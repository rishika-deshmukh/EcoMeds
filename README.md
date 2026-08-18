# EcoMeds

## **Circular Healthcare and Surplus Pharmaceutical Redistribution Platform**

Transforming pharmaceutical supply chains by bridging near-expiry medical surplus with verified charitable healthcare organizations.

---

## **Overview**

EcoMeds is a decentralized circular redistribution platform designed to prevent pharmaceutical waste by connecting **donor organizations**—such as manufacturing factory warehouses and retail pharmacies—with **verified non-profit organizations**, including community free clinics, charitable dispensaries, shelter homes, and disaster relief camps.

The platform combines **surplus inventory management, automated ESG scoring, and CSR tax benefit calculations**, aligned with **UN Sustainable Development Goals 3 (Good Health and Well-Being)** and **12 (Responsible Consumption and Production)**.

---

## **Mission**

To eliminate avoidable pharmaceutical incineration and landfill disposal by building an auditable, multi-tenant digital bridge that routes safe surplus medicines to underserved communities and healthcare facilities.

---

## **Key Benefits**

- **Waste Elimination:** Prevents avoidable destruction of usable medications nearing expiration.
- **Tenant Isolation:** Ensures competing pharmacies and manufacturers manage only their own private inventory.
- **Transparent Routing:** Aggregates multi-source surplus into a unified catalog for verified charitable organizations.
- **Shelter and Clinic Support:** Provides access to essential medications for non-profit shelters, free dispensaries, and rural clinics.
- **Quantified Sustainability:** Calculates landfill CO₂ emissions avoided and ESG scoring improvements.
- **Financial Incentives:** Estimates CSR tax relief values for eligible pharmaceutical donations.
- **Zero-Setup Persistence:** Uses persistent client-side data storage for rapid testing and low-overhead deployment.

---

## **Key Features**

### **1. Multi-Tenant Role-Based Access Control**

- **Enterprise Factory Portal:** Supports bulk allocations, high-volume batches, and corporate ESG metrics.
- **Retail Pharmacy Portal:** Designed for local pharmacies managing overstock and near-expiry units.
- **Recipient NGO Marketplace:** Centralized catalog for verified dispensaries, clinics, orphanages, and shelters.
- **Account Authentication:** Handles private logins, password validation, and session routing for each donor entity.

### **2. Dynamic Inventory and Expiry Urgency Management**

- **Urgency Stratification:** Automatically categorizes inventory as **Critical (<30 days), Urgent (<60 days), or Eligible (<90 days)**.
- **Batch-Level Tracking:** Records batch number, NDC reference, category, unit type, quantity, and expiry date.
- **Scoped Inventory Isolation:** Ensures each donor facility can only view, edit, and manage its own inventory.

### **3. Real-Time Requisition Marketplace**

- **Aggregated Search and Filter Engine:** Search across drug names, therapeutic categories, donor entities, and donor tiers.
- **Multi-Item Batch Cart:** Enables selection and reservation of multiple supplies for clinic requests.
- **Stock Synchronization:** Tracks batches through **available → reserved → claimed** states.

### **4. ESG and CSR Analytics Engine**

- **Emissions Diversion Model:** Estimates kilograms of landfill CO₂ emissions avoided through redistribution.
- **ESG Scorecard:** Provides a sustainability scoring index for donor facilities.
- **Tax Value Calculation:** Estimates tax benefits for eligible pharmaceutical donations.

---

## **Platform Screenshots**

### **Landing Page**

Public landing page with donor and recipient sign-in options.

![EcoMeds Landing Page Img 1](./screenshots/landing-page.png)
![EcoMeds Landing Page Img 2](./screenshots/landing_-page2.png)
![EcoMeds Landing Page Img 3](./screenshots/landing-page3.png)

### **Donor Dashboard (Private Inventory)**

Private inventory dashboard showing isolated surplus inventory and ESG metrics.

![Donor Inventory Dashboard](./screenshots/donor-dashboard.png)
![Donor ESG Metrics Dashboard](./screenshots/donor-dashboard2.png)

### **Surplus Medication Registration Modal**

Modal for donors to enter drug name, batch number, quantity, and expiry date.

![List Store Surplus Modal](./screenshots/add-medication.png)

### **Recipient NGO Requisition Marketplace**

Aggregated catalog showing available supplies, donor types, expiry categories, and requisition cart.

![Recipient Marketplace](./screenshots/recipient-dashboard.png)

#### 5. Requisition Cart & Batch Review Modal

Review interface for NGOs to verify selected batches, receiving clinics, and total rescued value before confirming claims.

![Requisition Batch Review](./screenshots/requisition-cart-modal.png)

#### 6. Chain-of-Custody Transfer Voucher (Order Confirmed)

Digital dispatch receipt generating verified voucher IDs and batch claim confirmations for NGO compliance.

![Chain of Custody Voucher](./screenshots/transfer-voucher-receipt.png)

---

## **Architecture**

### **Frontend**

- **Core Framework:** React 18 + TypeScript
- **Build System:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

### **State Management and Data Persistence**

- **Web Storage API:** `localStorage` for persistent user records and inventory data across sessions.
- **Reactive State:** React `useState` and `useEffect` for dynamic filtering, inventory updates, and cart management.

---

## **Expiry Urgency Categorization**

| **Tier** | **Window** | **Operational Action** |
|---|---|---|
| **Critical** | <30 Days | High-priority redistribution |
| **Urgent** | 30–60 Days | Priority requisition matching |
| **Eligible** | 60–90+ Days | Standard marketplace listing |

---

## **Workflow**

### **1. Registration & Authentication**
Register as an Enterprise Factory, Retail Store, or Recipient NGO.

### **2. Batch Upload**
Enter medication strength, batch number, quantity, and expiration date.

### **3. Private Inventory Tracking**
Track donation value, environmental impact, and batch status.

### **4. Catalog Discovery**
Browse and filter available supplies by donor type, category, or expiry status.

### **5. Requisition**
Select available batches and submit requests through the requisition cart.

### **6. Impact Review**
View ESG metrics, estimated tax benefits, and carbon-diversion summaries.

---

## **Technology Stack**

**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Backend:** Node.js, Express.js, REST APIs  
**Data:** SQL, MongoDB, Relational & Document Modeling  
**Security:** RBAC, Tenant Data Isolation, Session Management

---

## **Project Goals**

- ♻️ Reduce avoidable pharmaceutical waste
- 🏥 Improve access to essential medicines
- 🔐 Protect donor inventory through tenant isolation
- 📊 Quantify environmental and social impact
- 💰 Provide measurable CSR and sustainability insights
- 🌱 Support responsible pharmaceutical redistribution
