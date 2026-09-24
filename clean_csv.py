import re
import csv

raw_file = "raw_numbers.txt"
output_file = "numbers.csv"

valid_contacts = []
seen_numbers = set()

with open(raw_file, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        trimmed = line.strip()
        if not trimmed:
            continue
        
        # Skip headers
        lower = trimmed.lower()
        if "number" in lower or "phone" in lower or "name" in lower:
            continue
        
        # Clean non-digits
        digits = re.sub(r"\D", "", trimmed)
        
        # If standard 10 digit Indian mobile
        if len(digits) == 10 and digits[0] in "6789":
            formatted = "91" + digits
        elif len(digits) == 12 and digits.startswith("91") and digits[2] in "6789":
            formatted = digits
        elif len(digits) >= 10 and len(digits) <= 15:
            formatted = digits
        else:
            continue
        
        if formatted not in seen_numbers:
            seen_numbers.add(formatted)
            # Default name
            valid_contacts.append(("Valued Customer", formatted))

with open(output_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "number"])
    for name, num in valid_contacts:
        writer.writerow([name, num])

print(f"Total processed and saved: {len(valid_contacts)} unique contacts to {output_file}")
