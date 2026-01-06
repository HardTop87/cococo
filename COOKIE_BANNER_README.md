# Cookie Consent Manager - Implementation Guide

## ✅ Was wurde implementiert?

### **Zentrale Cookie-Banner-Lösung**
Statt den Cookie-Banner auf jeder Seite einzeln zu konfigurieren, wird er jetzt **automatisch über die Footer-Partial** auf allen Seiten geladen.

---

## 📁 Dateien-Struktur

### **Neue Dateien:**
1. **`cookie-init.js`** - Zentrale Konfiguration und Logik
2. **`silktide-consent-manager.js`** - Cookie-Banner Framework (von Silktide)
3. **`silktide-consent-manager.css`** - Angepasste Styles mit CoCoCo Branding

### **Geänderte Dateien:**
- **`partials/footer.html`** - Lädt Cookie-Banner-Scripte automatisch
- **`contact.html`** - HubSpot Form mit `data-hubspot-*` Attributen
- **`newsletter.html`** - HubSpot Form mit `data-hubspot-*` Attributen
- **`index.html`** - Bereinigt (Cookie-Banner läuft automatisch)

---

## 🎨 Branding-Anpassungen

### **Farben:**
- **Background:** `#4D2B41` (Dunkel-Lila)
- **Text:** `#FFFFFF` (Weiß)
- **Primary Color:** `#FF79C9` (Pink)
- **Backdrop:** `rgba(255, 121, 201, 0.4)` mit `10px` Blur

### **Position:**
- **Banner:** Bottom Center (zentriert am unteren Rand)
- **Cookie Icon:** Bottom Left (Cookie-Symbol links unten)

### **Schriftart:**
- **Font Family:** `'Sofia Sans'` (Ihre Brand-Schriftart)

---

## 🔧 Wie funktioniert es?

### **1. Automatische Integration über Footer**
Die `partials/footer.html` lädt am Ende:
```html
<link rel="stylesheet" href="silktide-consent-manager.css">
<script src="silktide-consent-manager.js"></script>
<script src="cookie-init.js"></script>
```

**Vorteil:** Jede Seite, die den Footer einbindet, hat automatisch den Cookie-Banner.

---

### **2. HubSpot Forms - Smart Loading**

#### **Alte Methode (manuell auf jeder Seite):**
```html
<script src="//js-eu1.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({...});
</script>
```

#### **Neue Methode (data-Attribute):**
```html
<div id="hubspot-form" 
     data-hubspot-form="FORM_ID"
     data-hubspot-portal="PORTAL_ID"
     data-hubspot-region="eu1">
</div>
```

**Vorteile:**
- ✅ Form lädt **nur**, wenn Marketing-Cookies akzeptiert wurden
- ✅ Bei Ablehnung: **Schöner Placeholder** mit Hinweis und Button
- ✅ DSGVO-konform (kein Tracking ohne Consent)

---

## 🍪 Cookie-Kategorien

### **1. Necessary Cookies (Notwendig)** ✅ Immer aktiv
- **Zweck:** Grundfunktionen der Website
- **Beispiele:**
  - Session-Management
  - localStorage für Pricing-Präferenzen (Währung, Billing-Intervall)
  - Sprach-Einstellungen

### **2. Marketing & Analytics** ⚠️ Opt-in erforderlich
- **Zweck:** HubSpot Forms und Tracking
- **Was trackt HubSpot:**
  - Form-Submissions
  - E-Mail-Adressen
  - Seitenaufrufe von Form-Seiten
  - User-Verhalten auf Formularen
- **Bei Akzeptanz:** HubSpot Forms werden geladen
- **Bei Ablehnung:** Placeholder mit Hinweis wird angezeigt

---

## 🎯 Placeholder für blockierte Inhalte

Wenn Marketing-Cookies abgelehnt werden, erscheint:

```
┌────────────────────────────────────────┐
│  🍪 (Icon)                             │
│  Cookie Consent Required               │
│                                        │
│  To use our contact form, please      │
│  accept marketing cookies.             │
│                                        │
│  [Update Cookie Preferences]           │
└────────────────────────────────────────┘
```

**Features:**
- ✅ Freundlicher Hinweis statt fehlendem Content
- ✅ Button öffnet Cookie-Einstellungen direkt
- ✅ CoCoCo-Branding (Pink-Button mit Hover-Effekt)

---

## 📝 Seiten mit HubSpot Forms

### **Bereits angepasst:**
1. ✅ `contact.html` - Kontaktformular
2. ✅ `newsletter.html` - Newsletter-Anmeldung

### **Falls weitere Seiten HubSpot Forms haben:**
Einfach die `data-hubspot-*` Attribute hinzufügen:
```html
<div id="my-form-container"
     data-hubspot-form="YOUR_FORM_ID"
     data-hubspot-portal="144439007"
     data-hubspot-region="eu1">
</div>
```

Der Rest passiert automatisch! 🎉

---

## 🧪 Testing-Checkliste

### **1. Cookie-Banner Anzeige**
- [ ] Banner erscheint beim ersten Besuch
- [ ] Banner ist zentriert am unteren Rand
- [ ] Background-Blur (`rgba(255, 121, 201, 0.4)`) ist sichtbar
- [ ] Cookie-Icon links unten ist sichtbar
- [ ] Farben entsprechen CoCoCo-Branding

### **2. Cookie-Einstellungen**
- [ ] "Accept all" akzeptiert alle Cookies
- [ ] "Reject non-essential" lehnt Marketing-Cookies ab
- [ ] "Preferences" öffnet Detail-Modal
- [ ] Einstellungen werden gespeichert (localStorage)

### **3. HubSpot Forms**
- [ ] Bei Akzeptanz: Form lädt korrekt
- [ ] Bei Ablehnung: Placeholder erscheint
- [ ] Button im Placeholder öffnet Cookie-Einstellungen
- [ ] Nach Akzeptanz: Form lädt automatisch nach

### **4. Cross-Browser**
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 🔒 DSGVO-Compliance

### **Was ist compliant:**
✅ Kein Tracking ohne Consent  
✅ Klare Kategorisierung (Necessary vs. Marketing)  
✅ Detaillierte Beschreibungen  
✅ Link zur Privacy Policy  
✅ Einfaches Widerrufsrecht (Cookie-Icon immer sichtbar)  
✅ Speicherung der Präferenzen in localStorage  

### **Was noch fehlt (optional):**
- Cookie-Liste in der Privacy Policy
- Link zu "Cookie-Einstellungen" in der Privacy Policy
- Dokumentation welche Cookies HubSpot genau setzt

---

## 🚀 Deployment

### **Dateien hochladen:**
1. `cookie-init.js`
2. `silktide-consent-manager.js`
3. `silktide-consent-manager.css`
4. `partials/footer.html` (aktualisiert)
5. `contact.html` (aktualisiert)
6. `newsletter.html` (aktualisiert)
7. `index.html` (bereinigt)

### **Cache leeren:**
Nach dem Deployment sollten User ihren Browser-Cache leeren, damit die neuen Scripte geladen werden.

---

## 🐛 Troubleshooting

### **Problem: Banner erscheint nicht**
- **Lösung:** Footer-Partial prüfen - sind die 3 Script-Tags vorhanden?
- **Lösung:** Browser-Cache leeren
- **Lösung:** JavaScript-Konsole prüfen auf Fehler

### **Problem: HubSpot Form lädt nicht**
- **Lösung:** `data-hubspot-*` Attribute prüfen
- **Lösung:** Form ID und Portal ID korrekt?
- **Lösung:** Marketing-Cookies akzeptiert?

### **Problem: Placeholder erscheint nicht**
- **Lösung:** `cookie-init.js` korrekt geladen?
- **Lösung:** Container hat `id` Attribut?
- **Lösung:** localStorage auf `silktide-cookie-consent` prüfen

---

## 📚 Weitere Ressourcen

- **Silktide Consent Manager:** https://silktide.com/consent-manager/
- **HubSpot Forms API:** https://developers.hubspot.com/docs/api/marketing/forms
- **DSGVO (GDPR):** https://gdpr.eu/
- **TDDDG (Deutschland):** § 25 Telekommunikation-Telemedien-Datenschutz-Gesetz

---

## ✨ Vorteile dieser Lösung

1. **Zentral verwaltet** - Eine Konfiguration für alle Seiten
2. **DSGVO-konform** - Kein Tracking ohne Consent
3. **User-freundlich** - Klare Hinweise bei blockierten Inhalten
4. **Wartbar** - Einfach zu erweitern für neue Seiten
5. **Performance** - HubSpot lädt nur bei Bedarf
6. **Branding** - Vollständig angepasst an CoCoCo Design

---

Made with ❤️ for Triple C Labs GmbH i.G.
