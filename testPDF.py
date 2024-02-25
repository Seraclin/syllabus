import pdfplumber  # Lib docs: https://github.com/jsvine/pdfplumber
import camelot  # https://camelot-py.readthedocs.io/en/master/; For dependencies - https://camelot-py.readthedocs.io/en/master/user/install-deps.html
import tkinter  # camelot dependency
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
    """Gets and prints the pdf's tables using camelot-py

    Parameters
    ----------
    pdf_path : str
        The file location of the pdf
    """
    tables = camelot.read_pdf(pdf_path, pages='all', strip_text='\n')  # make sure to get rid of newlines
    print(tables)
    tables.export('camelot.csv', f='csv')


# Testing the performance of various pdf extraction libraries
if __name__ == '__main__':
    pdf_path = "SOC385Test.pdf"
    # Note: Camelot > PDFPlumber with default settings
    print("====PDFPLUMBER====")
    extract_tables_from_pdf_plumber(pdf_path)
    print("====CAMELOT====")
    extract_tables_from_pdf_camelot(pdf_path)


