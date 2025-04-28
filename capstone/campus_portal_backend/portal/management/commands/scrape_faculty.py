from django.core.management.base import BaseCommand
from portal.models import Teacher
import spacy
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class Command(BaseCommand):
    help = 'Scrape faculty data and save into database'

    def handle(self, *args, **kwargs):
        nlp = spacy.load("en_core_web_sm")

        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        chrome_driver_path = r"C:\WebDriver\chromedriver-win64\chromedriver.exe"
        service = Service(chrome_driver_path)
        driver = webdriver.Chrome(service=service, options=chrome_options)

        FACULTY_PAGE_URL = "https://eied.thapar.edu/faculty"
        driver.get(FACULTY_PAGE_URL)

        wait = WebDriverWait(driver, 10)
        faculty_elements = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "faculty-box")))

        def clean_text(text):
            """Uses NLP to clean and format text properly."""
            doc = nlp(text.strip())
            return " ".join([token.text.capitalize() for token in doc if not token.is_punct])

        def categorize_designation(designation):
            """Categorizes faculty into levels based on designation."""
            designation = designation.lower()
            if "professor" in designation:
                return "Professor"
            elif "assistant" in designation:
                return "Assistant Professor"
            elif "associate" in designation:
                return "Associate Professor"
            else:
                return "Other"

        def split_name(name):
            """Splits name into prefix, first name, and last name."""
            doc = nlp(name)
            tokens = [token.text for token in doc if not token.is_punct]
            prefix_list = ["Dr", "Dr.", "Prof", "Prof.", "Mr", "Mr.", "Ms", "Ms.", "Mrs", "Mrs.", "DR.", "DR"]

            prefix = ""
            first_name = ""
            last_name = ""

            if len(tokens) == 0:
                return prefix, first_name, last_name

            if tokens[0] in prefix_list and len(tokens) >= 2:
                prefix = tokens[0]
                first_name = tokens[1]
                if len(tokens) >= 3:
                    last_name = " ".join(tokens[2:])
            else:
                first_name = tokens[0]
                if len(tokens) >= 2:
                    last_name = " ".join(tokens[1:])

            return prefix, first_name, last_name

        # Scraping data and saving into database
        for faculty in faculty_elements:
            try:
                # Extracting faculty details
                name = faculty.find_element(By.TAG_NAME, "strong").text.strip()
                designation = faculty.find_elements(By.TAG_NAME, "p")[1].text.strip()
                email = "N/A"
                p_tags = faculty.find_elements(By.TAG_NAME, "p")

                # Extract email
                for i in range(len(p_tags) - 1):
                    if "Email" in p_tags[i].text:
                        email = p_tags[i + 1].text.strip()
                        break

                # Clean and split name
                name = clean_text(name)
                designation = clean_text(designation)
                prefix, first_name, last_name = split_name(name)

                # Save or Update faculty data in the database
                Teacher.objects.update_or_create(
                    email=email,
                    defaults={
                        'prefix': prefix,
                        'first_name': first_name,
                        'last_name': last_name,
                        'designation': designation,
                        'email': email,
                    }
                )

            except Exception as e:
                # Error logging
                self.stdout.write(self.style.ERROR(f"Error extracting data: {e}"))
                continue

        # Quit the WebDriver
        driver.quit()

        # Success message
        self.stdout.write(self.style.SUCCESS('✅ Scraping and database update complete!'))
