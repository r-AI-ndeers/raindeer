FROM python:3.10

# Step 2. Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME

# Install dependencies required for CV projects
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "libgl1"]

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . ./

# Step 4: Run the web service on container startup using gunicorn webserver.
CMD exec gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.main:app --bind 0.0.0.0:${PORT}
