import pdfplumber  # Lib docs: https://github.com/jsvine/pdfplumber
import camelot  # https://camelot-py.readthedocs.io/en/master/; For dependencies - https://camelot-py.readthedocs.io/en/master/user/install-deps.html
import tkinter  # camelot dependency
import fitz  # PyMuPDF: https://pymupdf.readthedocs.io/en/latest/the-basics.html
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
from dotenv import load_dotenv

from openai import OpenAI






def extract_tables_from_pdf_plumber(pdf_path):
    """Gets and prints the pdf's tables using pdfplumber

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf
    """
    with pdfplumber.open(pdf_path) as pdf:
        for page_number in range(len(pdf.pages)):
            page = pdf.pages[page_number]
            tables = page.extract_tables()

            if tables:
                print(f"Tables found on Page {page_number + 1}:")
                im = page.to_image()  # Preview image
                im.debug_tablefinder()
                im.show()
                # Note: May need to edit parameters for finding tables (not grouping)
                for table_number, table in enumerate(tables):
                    print(f"Table {table_number + 1}:")
                    for row in table:
                        print(row)
                    print("-" * 30)
            else:
                print(f"No tables found on Page {page_number + 1}")


def extract_tables_from_pdf_camelot(pdf_path): # TODO
    """Gets and exports to csv the pdf's tables using camelot-py

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf
    """
    tables = camelot.read_pdf(pdf_path, pages='all', strip_text='\n')  # make sure to get rid of newlines
    if len(tables) < 1: # Returns table if just one page
        tables.export('camelot.csv', f='csv')
        return tables
    else: # Concatenates table vertically and returns the combined table (not exported to csv, will do that externally)
        data_concat = pd.concat([tables[0].df, tables[1].df], axis=0) # Sets a baseline of concatenating 2
        for i in range(2, len(tables)): # if less than 2, we skip this. If greater, we concatenate each one at a time (there might be a more efficient way)
            # print(tables[i].df)
            data_concat = pd.concat([data_concat, tables[i].df], axis=0)
        # print(tables)
        tables.export('camelot.csv', f='csv') # Kept this from original code, exports from tables (not data_concat), so there are multiple csv files
        return data_concat
        


def extract_tables_from_pdf_pymupdf(pdf_path): # TODO
    """Gets and exports to pandas dataframe the pdf's tables using pymupdf

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf
    """
    doc = fitz.open(pdf_path)  # open a document
    outName = pdf_path + "_table.csv"
    # dataframes = []  # list of DataFrames per table fragment
    for page in doc:  # iterate over the pages
        dataframes = []  # list of DataFrames per table fragment
        tabs = page.find_tables(strategy='lines', snap_tolerance=10)  # locate tables on page, by default goes by 'lines' but background images/colors can throw it off
        # snap_tolerance = how much y-distance between horizontal lines to be considered separate from each other. (e.g. tall table cells)
        if len(tabs.tables) == 0:  # no tables found?
            print("No table on page", page)  # stop
        else:
            tab = tabs[0]  # assume fragment to be 1st table, TODO: account for multiple tables on one page
            dataframes.append(tab.to_pandas())  # append this DataFrame
            df = pd.concat(dataframes)  # make concatenated DataFrame
            df.to_csv(outName)
            print(df)


    # df = pd.concat(dataframes)  # make concatenated DataFrame
    # df.to_csv(outName)
    # print(df)


# Extracts the text from a PDF and puts it into a .txt file
def extract_text_from_pdf_pymupdf(pdf_path):
    """Gets and exports to text the pdf's text using pymupdf.
    Note: The output will be plain text as it is coded in the document. No effort is made to prettify in any way.
    Specifically for PDF, this may mean output not in usual reading order, unexpected line breaks and so forth.

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf
    """
    doc = fitz.open(pdf_path)  # open a document
    outName = pdf_path+"_output.txt"
    out = open(outName, "wb")  # create a text output
    for page in doc:  # iterate the document pages
        text = page.get_text().encode("utf8")  # get plain text (is in UTF-8)
        out.write(text)  # write text of page
        out.write(bytes((12,)))  # write page delimiter (form feed 0x0C)
    out.close()

def extract_page_from_pdf_pymupdf(pdf_path, name):
    """Gets and exports to text the pdf's text using pymupdf.
    Note: The output will be plain text as it is coded in the document. No effort is made to prettify in any way.
    Specifically for PDF, this may mean output not in usual reading order, unexpected line breaks and so forth.

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf

    name : str
        The new name you want the files to be
        Format will be name_output_n.txt, where n is the page number
    """
    n = 1
    doc = fitz.open(pdf_path)  # open a document
    
    for page in doc:  # iterate the document pages
        outName = name + "_output_" + str(n) + ".txt"
        out = open(outName, "wb")  # create a text output
        text = page.get_text().encode("utf8")  # get plain text (is in UTF-8)
        out.write(text)  # write text of page
        out.write(bytes((12,)))  # write page delimiter (form feed 0x0C)
        n = n + 1
        out.close()


# Probably don't use this one
def extract_HTML_from_pdf_pymupdf(pdf_path):
    """Gets and exports to HTML the pdf's text using pymupdf.
    Note: struggles with images

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf

    
    """
    doc = fitz.open(pdf_path)  # open a document
    outName = pdf_path+"_output.html"
    out = open(outName, "wb")  # create a text output
    for page in doc:  # iterate the document pages
        text = page.get_text(option='html').encode("utf8")  # get plain text (is in UTF-8)
        out.write(text)  # write text of page
        out.write(bytes((12,)))  # write page delimiter (form feed 0x0C)
    out.close()

def extract_blocks_from_pdf_pymupdf(pdf_path):
    """Gets blocks of pdf's text using pymupdf.
    Outputs as a list of blocks: (x0, y0, x1, y1, "lines of text in the block", block_no, block_type)

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf
    """
    doc = fitz.open(pdf_path)  # open a document
    # outName = pdf_path+"_block.txt"
    # out = open(outName, "wb")  # create a text output
    for page in doc:  # iterate the document pages
        block = page.get_text(option='blocks')  # blocks
        for b in block:
            print(page, ", block", b[5], ":", b[4])
        # out.write(text)  # write text of page
        # out.write(bytes((12,)))  # write page delimiter (form feed 0x0C)
    # out.close()

def read_text_as_str(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        csv_content = file.read()
    return csv_content


def parse_pdf_as_text(pdf_path):
    """Gets and puts into a list the text the pdf provided has using pymupdf.
    Note: The output will be plain text as it is coded in the document. No effort is made to prettify in any way.
    Specifically for PDF, this may mean output not in usual reading order, unexpected line breaks and so forth.

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf

    """
    file_text = []
    doc = fitz.open(pdf_path)  # open a document
    for page in doc:  # iterate the document pages
        file_text.append(page.get_text())
    return file_text
        

# The first implementation of how we were calling ChatGPT. This only works if there are graphs present within the PDF
def run_gpt(csv_string):

    # Begins OpenAI Connection
    client = OpenAI(
        api_key = os.environ['OPENAI_API_KEY']
    )

    # Calls the first time where GPT parses the information into date and event pairs
    # This is under the assumption that only calendar dates are extracted
    completion = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=[
        {"role": "system", "content": "You convert the following data into pairs containing date and event name"},
        {"role": "user", "content": "" + csv_string}
      ]
    )
    print(completion.choices[0].message.content)

    # Calls a second time where GPT parses what it just had parsed
    completion = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=[
        {"role": "system", "content": "You turn the data provided into an ics file using the dates provided in the current year of 2024 resulting in non repeating events"},
        {"role": "user", "content": "" + completion.choices[0].message.content}
      ]
    )

    print(completion.choices[0].message.content)


    # Outputs ics File
    gpt_output = open("gptoutput.ics", "w")
    gpt_output.writelines(completion.choices[0].message.content)
    gpt_output.close()
    

    print("DONE")


# newer implementation of GPT
def run_gpt_broad(pdf_path, output):
    """ Using GPT, we take each page of a pdf and ask it a couple of questions
    1: Extract important dates 
    

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf

    output: str
        Name of the .ics file

    """

    # Begins OpenAI Connection
    client = OpenAI(
        api_key = os.environ['OPENAI_API_KEY']
    )

    # Gets the pdf parsed as a string in a list with each index being a page
    file_text = parse_pdf_as_text(pdf_path)
    # n = len(file_text)


    # Calls the first time where GPT parses the information into date and event pairs
    # This is under the assumption that only calendar dates are extracted
    parsed_events = []
    for page in file_text:
        completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Extract the dates and events mentioned in the article. First extract the date, then extract the name of the event, and finally set a description of the event while also mentioning if the event is either a Homework, Assessment or Event. "
            "Desired format: "
            "Date: -||- "
            "Event Name: -||- "
            "Description: -||- "},
            {"role": "user", "content": "" + str(page)}
        ]
        )
        parsed_events.append(completion.choices[0].message.content)
        print(completion.choices[0].message.content)
        print("=====Space=====")

    # Need to parse entire PDF into a str while not exceeding the limits of OpenAI



    completion = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=[
        {"role": "system", "content": "Convert the data provided into an ics file using the information provided in the current year of 2024 resulting in non repeating events"},
        {"role": "user", "content": "" + ''.join(parsed_events)}
      ]
    )
    gpt_output = open(str(output) + ".ics", "w")
    gpt_output.writelines(completion.choices[0].message.content)
    gpt_output.close()





# Testing the performance of various pdf extraction libraries
if __name__ == '__main__':
    load_dotenv()
    pdf_path = "SOC385Test.pdf"
    run_gpt_broad(pdf_path, "gpt_broad_output")



    # Note: Camelot > PDFPlumber with default settings for tables. However, Camelot doesn't handle any non-table data
    # print("====PDFPLUMBER====")
    # extract_tables_from_pdf_plumber(pdf_path)

    # print("====CAMELOT====")
    # extract_tables_from_pdf_camelot(pdf_path) # Try using this

    # print("====PYMUPDF====")
    # Haven't figured out the table parameters yet....
    # Note: PyMuPDF can handle tables and format to HTML.
    # For text: https://pymupdf.readthedocs.io/en/latest/recipes-text.html#text
    # for tables: https://pymupdf.readthedocs.io/en/latest/page.html#Page.find_tables

    # extract_text_from_pdf_pymupdf(pdf_path)
    # extract_page_from_pdf_pymupdf(pdf_path)
    # print(read_text_as_str("SOC385Test.pdf_output_1.txt"))
    # for i in parse_pdf_as_text(pdf_path):
    #     print(i)
    #     print("=====BREAK=====")

    # extract_HTML_from_pdf_pymupdf(pdf_path)
    # extract_tables_from_pdf_pymupdf(pdf_path)
    # extract_blocks_from_pdf_pymupdf(pdf_path)



    # Example usage: This will run the code
    # tables = extract_tables_from_pdf_camelot(pdf_path)
    # print("==========SPACE==========")
    # # print(tables)
    # tables.to_csv('camelot-concat.csv')
    # file_path = 'camelot-concat.csv'
    # csv_string = read_text_as_str(file_path)
    # # print(csv_string) # TEST
    # # run_gpt(csv_string)


    # test2 = read_text_as_str("camelot-page-5-table-1.csv")
    # print(test2)
    # csvfull = open('camelot-concat.csv', 'r')

    # data = pd.read_csv("camelot-page-5-table-1.csv")
    # print("space")
    # print(data)
    # print("space")
    # print(tables[0].df)

    

    
    


