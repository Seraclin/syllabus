import fitz  # PyMuPDF: https://pymupdf.readthedocs.io/en/latest/the-basics.html
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
import sys
from dotenv import load_dotenv


from openai import OpenAI















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
        




def is_pdf(file_path):
    if(file_path.endswith('.pdf')):
        return True
    return False

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
    
    # n = len(file_text)


    # Calls the first time where GPT parses the information into date and event pairs
    # This is under the assumption that only calendar dates are extracted
    parsed_events = []

    for file in os.listdir(pdf_path):
        print("Running GPT for File: " + file)
        if not is_pdf(pdf_path + "\\" + file): continue
        file_text = parse_pdf_as_text(pdf_path + "\\" + file)
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
            # print(completion.choices[0].message.content)
            # print("=====Space=====")

    # Need to parse entire PDF into a str while not exceeding the limits of OpenAI



    completion = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=[
        {"role": "system", "content": "Convert the data provided into an ics file. The ics file includes CALSCALE: GREGORIAN, SUMMARY:, and DTSTART;VALUE=DATE: in the year 2024. Make sure the file is not corrupted when generated"},
        {"role": "user", "content": "" + ''.join(parsed_events)}
      ]
    )
    if os.path.exists(pdf_path + '\\' + str(output) + ".ics"):
        print("ics file detected, deleting file")
        os.remove(pdf_path + '\\' + str(output) + ".ics")

    gpt_output = open(pdf_path + '\\' + str(output) + ".ics", "w")
    gpt_output.writelines(completion.choices[0].message.content)
    gpt_output.close()





# Testing the performance of various pdf extraction libraries
if __name__ == '__main__':
    load_dotenv()
    
    pdf_path = 'src\\app\\api\\upload\\user_files\\' + sys.argv[1]
    print("Path to folder is: " + pdf_path)
    
    print("Files that will be consolidated: ")
    n = 0
    for file in os.listdir(pdf_path):
        if is_pdf(file):
            n += 1
        print(file)

    print("pdf path = " + pdf_path)
    if n != 0: 
        # print("n = " + str(n))
        # if (input('Are you sure you want to run GPT? y to confirm, literally anything else to cancel ') == 'y'):
        run_gpt_broad(pdf_path, "eSyllabus")
    print("Process has ended with " + str(n) + " syllabi being consolidated")




    

    
