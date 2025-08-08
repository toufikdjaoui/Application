import re
import unicodedata
from typing import str

def generate_slug(text: str) -> str:
    """
    Generate URL-friendly slug from text
    Handles both French and Arabic text
    """
    # Normalize unicode characters
    text = unicodedata.normalize('NFKD', text)
    
    # Remove Arabic diacritics and normalize
    arabic_diacritics = re.compile(r'[\u064B-\u065F\u0670\u0640]')
    text = arabic_diacritics.sub('', text)
    
    # Convert to lowercase
    text = text.lower()
    
    # Replace spaces and special characters with hyphens
    text = re.sub(r'[^\w\s\u0600-\u06FF-]', '', text)  # Keep Arabic characters
    text = re.sub(r'[-\s]+', '-', text)
    
    # Remove leading/trailing hyphens
    text = text.strip('-')
    
    # Limit length
    if len(text) > 100:
        text = text[:100].rstrip('-')
    
    return text or 'product'

def slugify_arabic(text: str) -> str:
    """
    Specialized slugify for Arabic text
    """
    # Remove diacritics
    text = re.sub(r'[\u064B-\u065F\u0670\u0640]', '', text)
    
    # Replace spaces with hyphens
    text = re.sub(r'\s+', '-', text)
    
    # Remove non-Arabic, non-alphanumeric characters except hyphens
    text = re.sub(r'[^\u0600-\u06FF\w-]', '', text)
    
    # Remove multiple consecutive hyphens
    text = re.sub(r'-+', '-', text)
    
    # Remove leading/trailing hyphens
    text = text.strip('-')
    
    return text.lower()

def transliterate_arabic_to_latin(text: str) -> str:
    """
    Basic transliteration of Arabic to Latin characters
    For URL-friendly slugs
    """
    arabic_to_latin = {
        'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h',
        'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's',
        'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
        'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
        'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'h',
        'ء': 'a', 'آ': 'aa', 'أ': 'a', 'إ': 'i', 'ؤ': 'u', 'ئ': 'i'
    }
    
    result = ''
    for char in text:
        if char in arabic_to_latin:
            result += arabic_to_latin[char]
        elif char.isalnum() or char in '-_':
            result += char
        elif char.isspace():
            result += '-'
    
    # Clean up the result
    result = re.sub(r'-+', '-', result)
    result = result.strip('-')
    
    return result.lower()
