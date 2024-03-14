# Use the official Python runtime as a parent image
FROM python:3.12.1

# Set the working directory to /app
WORKDIR /project

# Copy the requirements file into the container at /app
COPY requirements.txt /project

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt  

# Copy the rest of the application code into the container at /app
COPY . /project

# Expose port 80 for the FastAPI app to listen on
EXPOSE 8000

# Define the command to run your FastAPI application when the container starts
# CMD ["uvicorn", "main:app", "--reload","--port=8000","--host=0.0.0.0"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]