import pdfplumber  # Lib docs: https://github.com/jsvine/pdfplumber
import camelot  # https://camelot-py.readthedocs.io/en/master/; For dependencies - https://camelot-py.readthedocs.io/en/master/user/install-deps.html
import tkinter  # camelot dependency
import fitz  # PyMuPDF: https://pymupdf.readthedocs.io/en/latest/the-basics.html
import pandas as pd


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


def extract_tables_from_pdf_camelot(pdf_path):
    """Gets and exports to csv the pdf's tables using camelot-py

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf
    """
    tables = camelot.read_pdf(pdf_path, pages='all', strip_text='\n')  # make sure to get rid of newlines
    print(tables)
    tables.export('camelot.csv', f='csv')

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


# Testing the performance of various pdf extraction libraries
if __name__ == '__main__':
    pdf_path = "SOC385Test.pdf"
    # Note: Camelot > PDFPlumber with default settings for tables. However, Camelot doesn't handle any non-table data
    # print("====PDFPLUMBER====")
    # extract_tables_from_pdf_plumber(pdf_path)
    # print("====CAMELOT====")
    # extract_tables_from_pdf_camelot(pdf_path)
    print("====PYMUPDF====")
    # Clear winner here!
    # Note: PyMuPDF can handle tables and format to HTML.
    # For text: https://pymupdf.readthedocs.io/en/latest/recipes-text.html#text
    # for tables: https://pymupdf.readthedocs.io/en/latest/page.html#Page.find_tables
    extract_text_from_pdf_pymupdf(pdf_path)
    extract_HTML_from_pdf_pymupdf(pdf_path)

    print("DONE")

