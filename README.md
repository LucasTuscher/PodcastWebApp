# 🎧 PodcastWebApp

Ein Fullstack-Projekt für eine Podcast-Plattform, entwickelt mit **HTML**, **CSS**, **JavaScript**, dem **Node.js-Framework**, und einer **MongoDB**-Datenbank.  
Das Projekt ist in ein **Frontend** und ein **Backend** aufgeteilt und verwendet **Docker** zur Containerisierung sowie **GitLab CI/CD** zur Automatisierung.

---

## 🔧 Projektstruktur

PodcastWebApp/
│
├── frontend/ # HTML/CSS/JS-Client mit Webplayer & UI
│ ├── public/
│ └── src/
│
├── backend/ # Node.js-Server, API & MongoDB-Anbindung
│ ├── routes/
│ └── session-system/
│
├── docker/ # Docker & Compose Konfigurationen
├── .gitlab-ci.yml # GitLab CI/CD Konfiguration
├── docker-compose.yml
└── README.md


---

## 🚀 Technologien

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js (Express)
- **Datenbank**: MongoDB
- **Containerisierung**: Docker & Docker Compose
- **CI/CD**: GitLab
- **Versionierung**: Git

---

## 🧩 Voraussetzungen

- Node.js (v18+ empfohlen)
- MongoDB lokal oder remote (z. B. Atlas)
- Docker & Docker Compose (optional für Deployment)
- Git (für Klonen & Versionierung)

---

## ⚙️ Projekt starten

### Lokaler Start (ohne Docker):

```bash
# Backend installieren und starten
cd backend
npm install
npm start

# In neuem Terminal: Frontend starten
cd ../frontend
npm install
npm start
