# Lib docs: https://github.com/jsvine/pdfplumber
import pdfplumber
import pandas as pd

def extract_tables_from_pdf(pdf_path):
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

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    pdf_path = "SOC385Test.pdf"
    extract_tables_from_pdf(pdf_path)

