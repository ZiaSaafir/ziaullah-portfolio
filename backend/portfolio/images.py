from io import BytesIO
from pathlib import Path

from django.core.files.base import ContentFile
from django.core.files.uploadedfile import UploadedFile
from PIL import Image, ImageOps


def optimize_uploaded_image(image_field):
    if not image_field:
        return
    upload = image_field.file
    if not isinstance(upload, UploadedFile):
        return

    with Image.open(upload) as source:
        optimized = ImageOps.exif_transpose(source)
        optimized.thumbnail((1600, 1200), Image.Resampling.LANCZOS)
        mode = "RGBA" if "A" in optimized.getbands() else "RGB"
        optimized = optimized.convert(mode)
        output = BytesIO()
        optimized.save(output, format="WEBP", quality=82, method=6)

    optimized_name = str(Path(image_field.name).with_suffix(".webp"))
    image_field.save(optimized_name, ContentFile(output.getvalue()), save=False)
