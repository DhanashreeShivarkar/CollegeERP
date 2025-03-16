from setuptools import setup, find_packages

setup(
    name="collegeERP",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'Django>=4.2.7',
        'djangorestframework>=3.14.0',
        'django-cors-headers>=4.3.0',
        'djangorestframework-simplejwt>=5.3.0',
        'Pillow>=10.1.0',
        'psycopg2>=2.9.9',
        'python-dotenv>=1.0.0',
    ],
)
