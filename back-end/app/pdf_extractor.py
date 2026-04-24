import json
import os
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def _clean_json_text(text: str) -> str:
    text = text.strip()

    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    return text.strip()


def extract_student_progress_from_pdf(pdf_path: str) -> dict[str, Any]:
    """
    Upload a PDF to OpenAI and ask the model to extract
    academic progress information as strict JSON.
    """

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    with open(pdf_path, "rb") as f:
        uploaded_file = client.files.create(
            file=f,
            purpose="user_data",
        )

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "developer",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            "You extract student academic progress data from university progress reports. "
                            "Return ONLY valid JSON. Do not add explanations, markdown, or extra text."
                        ),
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            "Read this academic progress report PDF and extract the student's information. "
                            "Return JSON with exactly this shape:\n"
                            "{\n"
                            '  "student_name": "",\n'
                            '  "student_id": "",\n'
                            '  "degree_program": "",\n'
                            '  "catalog_year": "",\n'
                            '  "completed_courses": [\n'
                            "    {\n"
                            '      "course_code": "",\n'
                            '      "course_name": "",\n'
                            '      "units": 0,\n'
                            '      "grade": ""\n'
                            "    }\n"
                            "  ],\n"
                            '  "in_progress_courses": [\n'
                            "    {\n"
                            '      "course_code": "",\n'
                            '      "course_name": "",\n'
                            '      "units": 0\n'
                            "    }\n"
                            "  ],\n"
                            '  "missing_requirements": [],\n'
                            '  "notes": ""\n'
                            "}\n"
                            "If something is missing in the PDF, use an empty string, empty array, or 0."
                        ),
                    },
                    {
                        "type": "input_file",
                        "file_id": uploaded_file.id,
                    },
                ],
            },
        ],
    )

    raw_text = response.output_text
    cleaned = _clean_json_text(raw_text)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(
            "The AI response was not valid JSON.\n"
            f"Raw response:\n{raw_text}"
        ) from e