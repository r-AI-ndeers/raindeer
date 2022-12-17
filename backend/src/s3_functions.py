import boto3
import uuid
import os

class S3Uploader:
    def __init__(self, bucket_name, aws_access_key_id, aws_secret_access_key, region_name):
        self.s3 = boto3.resource(
                    service_name='s3',
                    region_name=region_name,
                    aws_access_key_id=aws_access_key_id,
                    aws_secret_access_key=aws_secret_access_key
                    )
        self.bucket = self.s3.Bucket(bucket_name)     

    def upload_to_s3(self, img):
        uuid_filename = f'{uuid.uuid4().hex}.jpg'
        img.save(uuid_filename)        
        self.bucket.upload_file(
            Filename=uuid_filename, 
            Key=f'temp_imgs/{uuid_filename}', 
            ExtraArgs={ "ContentType": "image/jpg"}
            )        
        os.remove(uuid_filename)
        s3_url = f'https://raindeers-bucket.s3.eu-central-1.amazonaws.com/temp_imgs/{uuid_filename}'
        print(f'uploaded to s3: {s3_url}')
        return s3_url


aws_key = os.getenv("AWS_KEY")
aws_secret_key = os.getenv("AWS_SECRET_KEY")
S3_UPLOADER = S3Uploader('raindeers-bucket', aws_key, aws_secret_key, 'eu-central-1')
