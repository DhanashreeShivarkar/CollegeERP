from setuptools import setup, find_packages

# Add version definition
__version__ = '1.0.0'

setup(
    name="CollegeERP",
    version=__version__,
    packages=find_packages(),
    description="College ERP System",
    author="Tejas",
    author_email="your.email@example.com",
    url="https://github.com/yourusername/collegeERP",
    install_requires=[
        "Django==4.2.7",
        "djangorestframework==3.14.0",
        "django-cors-headers==4.3.0",
        "psycopg2==2.9.9",
        "gunicorn>=20.0,<21.0",
        "Pillow==10.1.0",
        "django-environ>=0.4,<0.5",
        "django-rest-knox>=2.0,<3.0",
        "drf-yasg>=1.20,<2.0",
        "djangorestframework-simplejwt==5.3.0",
        "python-dotenv==1.0.0",
        "celery>=5.1,<6.0",
        "redis>=4.0,<5.0",
        "pytest==7.4.3",
        "pytest-django==4.7.0",
    ],
)
