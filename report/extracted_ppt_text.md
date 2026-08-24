## Slide 1
AI-Based Social Media Sentiment and Trend Analysis Platform for Women’s Safety
FINAL YEAR B.TECH CAPSTONE PROJECT
CSE-3  | BATCH-220
PROJECT TEAM :
KAVYA NAYANA — 2300033848INTI HANITHA SAI GAYATHRI — 2300032512KOKKILIGADDA T.V. DURGA RAO — 2300032267BADAM SUDHEER REDDY — 2300033278GARIKAPATI SATYA KARTHIKA — 2300030988
Guide: Mr. M. Subba Rao (M-Tech)
Assistant Professor, Department of Computer Science and Engineering
KL University | Department of Computer Science and Engineering  | Academic Year 2026–27

## Slide 2
KL University | Department of Computer Science and Engineering  | Academic Year 2026–27
•  Women’s safety is an important social concern, and social media contains public discussions about incidents. 
•   Safety-related posts are often informal, unstructured and difficult to review    manually. 
• Large volumes of posts make it difficult to identify important information quickly. 
• Repeated reports from the same location may not be obvious when posts are viewed separately. 
• Different incidents can have different levels of concern and require suitable classification. 
• A simple visual system is needed to understand safety patterns across time and locations. 
• Our project uses AI and data analysis to organize these observations into useful  insights. 
• The system is designed as an academic prototype to support awareness and analysis.
PROBLEM AND MOTIVATION
Social Media → Large Data → Manual Analysis → Difficult

## Slide 3
PROBLEM STATEMENT
• Safety-related information is available across different social-media posts.• The information is not available in one organized form.• Identifying sentiment from a large number of posts is difficult manually.• Finding common incident patterns also requires detailed analysis.• Location-based safety information may be difficult to understand from individual posts.• There is a need for a simple platform to organize this information.• The project will explore AI-based text and trend analysis techniques.• The proposed idea will be studied and developed during the capstone project.
KL University | Department of Computer Science and Engineering  | Academic Year 2026–27

## Slide 4
LITERATURE SURVEY
We are currently studying existing research related to women’s safety.• Previous studies use social-media data for sentiment analysis.• NLP techniques are commonly used for processing social-media text.• Machine-learning methods are used for text classification.• Some studies analyze safety concerns based on location or incident type.• Research also explores visualization of social-media analysis results.• These studies help us understand suitable methods for our project.• The literature survey will help us finalize our project methodology.
KL University | Department of Computer Science and Engineering  | Academic Year 2026–27

## Slide 5
KL University | Department of Computer Science and Engineering  | Academic Year 2026–27
• Collect relevant social-media data related to women’s safety.• Clean and preprocess the collected text.• Analyze the sentiment of the posts using NLP techniques.• Classify posts based on the type of safety-related incident.• Study patterns based on time and available location information.• Present the analyzed information through a simple dashboard.• Explore potential risk-zone visualization based on available data.• Study the possibility of adding an IoT-based SOS wearable.
PROPOSED IDEA

## Slide 6
PROPOSED DASHBOARD PROCESS
DATACollection of relevant social-media posts or a suitable dataset related to women’s safety.
         ↓
DATA CLEANINGRemove unwanted characters, duplicate posts, links and unnecessary information from the data.
         ↓
NLP ANALYSISProcess the text using Natural Language Processing techniques to understand the content.
         ↓
SENTIMENT & INCIDENT CLASSIFICATIONIdentify the sentiment and classify posts according to the type of safety-related incident.
         ↓
TREND ANALYSISStudy the frequency and changes in safety-related posts over different time periods.
         ↓
LOCATION ANALYSISAnalyze available location information to identify areas with repeated safety-related reports.
         ↓
DASHBOARDPresent the analyzed information using charts, filters, trends and a map for easy understanding.
KL University | Department of Computer Science and Engineering  | Academic Year 2026–27

## Slide 7
Project Cost Estimation
The proposed project is designed to be cost-effective for a final-year B.Tech prototype. 
Most of the software tools used in the project are free and open-source. 
The main expense is for the IoT-based wearable safety prototype. 
The hardware includes ESP32, GPS module, SOS button, buzzer, battery and basic components. 
The estimated hardware cost is approximately ₹1,900. 
Depending on additional components, the total cost may range between ₹1,900 and ₹2,500. 
No major software licensing cost is expected during development. 
Estimated overall project budget: ₹1,900–₹2,500.
ESP-32 Development Board
COST : ₹500
GPS Module (NEO-6M)
COST : ₹600
BUZZER COST : ₹60
KL University | Department of Computer Science and Engineering  | Academic Year 2026–27
SOS BUTTON
COST : ₹250
WIRE KIT COST: ₹300

## Slide 8
KL University | Department of Computer Science and Engineering | Academic Year 2026–27
IoT WEARABLE AND SOS
ESP32 is used as the main controller for the proposed wearable prototype. 
A GPS module provides the approximate location of the user. 
The current location can be compared with selected potential risk zones. 
An alert can be generated when the user enters a designated risk area. 
A physical SOS button can create an emergency event in the prototype. 
A buzzer or vibration motor can provide a local warning to the user. 
Wi-Fi can be used for the initial prototype, with GSM or LTE as a future extension. 
The wearable connects the project’s data analysis with a practical safety-assistance feature.
GPS
  ↓
   ESP32
 ↙     ↘
        BUZZER               SOS BUTTON
  ↓                             ↓
         ALERT                  EMERGENCY

## Slide 9
KL University | Department of Computer Science and Engineering  | Academic Year 2026–27
DASHBOARD AND POTENTIAL RISK ZONES
The dashboard provides a simple overview of the analyzed safety-related information. 
Sentiment charts show positive, negative and neutral distributions. 
Incident charts compare different types of reported safety concerns. 
Time-based graphs show how reports change during selected periods. 
A map view can display the geographic concentration of analyzed reports. 
Filters allow users to select time period, location and incident type. 
Potential high-risk zones can be highlighted using repeated reported-data patterns. 
The dashboard makes the project results easier for users and mentors to understand
PositiveNegativeNeutral
INCIDENT ANALYSIS
LOCATION / MAP