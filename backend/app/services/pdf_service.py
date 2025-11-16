"""
PDF Service
שירות יצירת PDF מעוצב בעברית
"""
import os
from datetime import datetime
from typing import Dict, Any, Optional
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_RIGHT, TA_CENTER
from bidi.algorithm import get_display
import arabic_reshaper
from loguru import logger
from app.config import settings


class PDFService:
    """שירות יצירת PDF"""
    
    def __init__(self):
        """אתחול השירות והגדרת פונטים"""
        self.output_dir = settings.PDF_OUTPUT_DIR
        
        # יצירת תיקייה אם לא קיימת
        os.makedirs(self.output_dir, exist_ok=True)
        
        # רישום פונט עברי (נדרש להוריד Arial או להשתמש בפונט אחר)
        # אם אין Arial, אפשר להשתמש ב-DejaVu Sans
        try:
            # נסה לטעון Arial
            pdfmetrics.registerFont(TTFont('Hebrew', 'Arial.ttf'))
        except:
            try:
                # אם לא, נסה DejaVuSans
                pdfmetrics.registerFont(TTFont('Hebrew', 'DejaVuSans.ttf'))
            except:
                logger.warning("לא נמצא פונט עברי, הטקסט עלול להיות בעייתי")
    
    def create_submission_pdf(
        self, 
        submission_data: Dict[str, Any],
        form_data: Dict[str, Any]
    ) -> str:
        """
        יצירת PDF לשליחת טופס
        
        Args:
            submission_data: נתוני השליחה
            form_data: נתוני הטופס
            
        Returns:
            נתיב לקובץ PDF שנוצר
        """
        try:
            # יצירת שם קובץ ייחודי
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            candidate_name = submission_data.get('full_name', 'candidate').replace(" ", "_")
            filename = f"submission_{candidate_name}_{timestamp}.pdf"
            filepath = os.path.join(self.output_dir, filename)
            
            # יצירת מסמך
            doc = SimpleDocTemplate(filepath, pagesize=A4)
            story = []
            
            # סגנונות
            styles = self._create_hebrew_styles()
            
            # כותרת ראשית
            story.append(Paragraph(
                self._reshape_hebrew(f"טופס סינון - {form_data.get('job_title', '')}"),
                styles['Title']
            ))
            story.append(Spacer(1, 0.5*cm))
            
            # לוגו (אם קיים)
            if form_data.get('company_logo_url'):
                try:
                    logo = Image(form_data['company_logo_url'], width=4*cm, height=2*cm)
                    story.append(logo)
                    story.append(Spacer(1, 0.5*cm))
                except:
                    logger.warning("לא הצלחנו לטעון את הלוגו")
            
            # פרטי חברה
            story.append(Paragraph(
                self._reshape_hebrew(form_data.get('company_name', '')),
                styles['Heading1']
            ))
            story.append(Spacer(1, 0.3*cm))
            
            # פרטי מועמד
            story.append(Paragraph(
                self._reshape_hebrew("פרטי מועמד"),
                styles['Heading2']
            ))
            story.append(Spacer(1, 0.2*cm))
            
            candidate_data = [
                [self._reshape_hebrew("שם מלא:"), self._reshape_hebrew(submission_data.get('full_name', ''))],
                [self._reshape_hebrew("טלפון:"), submission_data.get('phone_number', '')],
                [self._reshape_hebrew("אימייל:"), submission_data.get('email', 'לא צוין')],
                [self._reshape_hebrew("עיר:"), self._reshape_hebrew(submission_data.get('city', ''))],
            ]
            
            candidate_table = Table(candidate_data, colWidths=[5*cm, 10*cm])
            candidate_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
                ('FONTNAME', (0, 0), (-1, -1), 'Hebrew'),
                ('FONTSIZE', (0, 0), (-1, -1), 11),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('LEFTPADDING', (0, 0), (-1, -1), 12),
                ('RIGHTPADDING', (0, 0), (-1, -1), 12),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ]))
            
            story.append(candidate_table)
            story.append(Spacer(1, 0.5*cm))
            
            # תשובות לשאלות סינון
            if submission_data.get('screening_answers'):
                story.append(Paragraph(
                    self._reshape_hebrew("תשובות לשאלות סינון"),
                    styles['Heading2']
                ))
                story.append(Spacer(1, 0.2*cm))
                
                answers_data = []
                for q_id, answer in submission_data['screening_answers'].items():
                    # מצא את השאלה המתאימה
                    question_text = self._find_question_text(q_id, form_data.get('screening_questions', []))
                    answers_data.append([
                        self._reshape_hebrew(question_text),
                        self._reshape_hebrew(str(answer))
                    ])
                
                if answers_data:
                    answers_table = Table(answers_data, colWidths=[8*cm, 7*cm])
                    answers_table.setStyle(TableStyle([
                        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
                        ('FONTNAME', (0, 0), (-1, -1), 'Hebrew'),
                        ('FONTSIZE', (0, 0), (-1, -1), 10),
                        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                        ('BACKGROUND', (0, 0), (0, -1), colors.lightblue),
                        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                        ('LEFTPADDING', (0, 0), (-1, -1), 10),
                        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                        ('TOPPADDING', (0, 0), (-1, -1), 6),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ]))
                    story.append(answers_table)
                    story.append(Spacer(1, 0.5*cm))
            
            # סטטוס סינון
            passed = submission_data.get('passed_screening', False)
            status_text = "עבר את הסינון ✓" if passed else "לא עבר את הסינון ✗"
            status_color = colors.green if passed else colors.red
            
            story.append(Paragraph(
                self._reshape_hebrew(f"סטטוס: {status_text}"),
                styles['Heading2']
            ))
            story.append(Spacer(1, 0.3*cm))
            
            # אישור תנאים
            if submission_data.get('accepted_terms'):
                story.append(Paragraph(
                    self._reshape_hebrew("המועמד אישר את תנאי העבודה ✓"),
                    styles['Normal']
                ))
            
            story.append(Spacer(1, 0.5*cm))
            
            # תאריך יצירה
            creation_date = datetime.now().strftime("%d/%m/%Y %H:%M")
            story.append(Paragraph(
                self._reshape_hebrew(f"תאריך: {creation_date}"),
                styles['Small']
            ))
            
            # בניית המסמך
            doc.build(story)
            
            logger.info(f"PDF נוצר בהצלחה: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"שגיאה ביצירת PDF: {str(e)}")
            raise
    
    def _create_hebrew_styles(self):
        """יצירת סגנונות לטקסט עברי"""
        styles = getSampleStyleSheet()
        
        # כותרת ראשית
        styles.add(ParagraphStyle(
            name='Title',
            fontName='Hebrew',
            fontSize=20,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=12,
            bold=True
        ))
        
        # כותרת משנה 1
        styles.add(ParagraphStyle(
            name='Heading1',
            fontName='Hebrew',
            fontSize=16,
            alignment=TA_RIGHT,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=6,
            bold=True
        ))
        
        # כותרת משנה 2
        styles.add(ParagraphStyle(
            name='Heading2',
            fontName='Hebrew',
            fontSize=14,
            alignment=TA_RIGHT,
            textColor=colors.HexColor('#34495e'),
            spaceAfter=6,
            bold=True
        ))
        
        # טקסט רגיל
        styles.add(ParagraphStyle(
            name='Normal',
            fontName='Hebrew',
            fontSize=11,
            alignment=TA_RIGHT,
            textColor=colors.black
        ))
        
        # טקסט קטן
        styles.add(ParagraphStyle(
            name='Small',
            fontName='Hebrew',
            fontSize=9,
            alignment=TA_RIGHT,
            textColor=colors.grey
        ))
        
        return styles
    
    def _reshape_hebrew(self, text: str) -> str:
        """עיצוב טקסט עברי לתצוגה נכונה ב-PDF"""
        if not text:
            return ""
        try:
            reshaped_text = arabic_reshaper.reshape(text)
            bidi_text = get_display(reshaped_text)
            return bidi_text
        except:
            return text
    
    def _find_question_text(self, question_id: str, questions: list) -> str:
        """מציאת טקסט השאלה לפי ID"""
        for q in questions:
            if q.get('id') == question_id:
                return q.get('question', question_id)
        return question_id
