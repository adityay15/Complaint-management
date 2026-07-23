import io
from email import message_from_bytes

from docx import Document
from pypdf import PdfReader


def extract_text_from_upload(filename: str, content: bytes) -> str:
    lower_name = filename.lower()

    if lower_name.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(content))
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    if lower_name.endswith(".docx"):
        doc = Document(io.BytesIO(content))
        return "\n".join(para.text for para in doc.paragraphs)

    if lower_name.endswith(".eml"):
        message = message_from_bytes(content)
        if message.is_multipart():
            parts = [
                part.get_payload(decode=True).decode(errors="ignore")
                for part in message.walk()
                if part.get_content_type() == "text/plain"
            ]
            return "\n".join(parts)
        return message.get_payload(decode=True).decode(errors="ignore")

    return content.decode(errors="ignore")
