 
<h1 align="center">gp-grid Playground 🔥</h1>

An interactive React playground showcasing [gp-grid](https://gp-grid.io/). The project was created as a hands-on experiment to explore gp-grid in a React application through seven focused demos covering virtual scrolling, sorting, filtering, selection, inline editing, custom cell renderers, live data updates, column layouts, row grouping, and pivoting.

---

## ✨ Features

- ⚡ **Virtual Scrolling:** Test grid performance with datasets containing 15,000, 100,000, and 1 million rows
- ↕️ **Sorting & Filtering:** Organize and filter records directly inside the grid
- ☑️ **Row Selection:** Select rows and work with multiple records
- ✏️ **Inline Editing:** Edit cell values directly inside the grid
- ⌨️ **Keyboard Navigation:** Navigate through cells using keyboard controls
- 🖱️ **Fill Handle:** Extend cell values across multiple rows
- 🧩 **Custom Editors:** Use a multi-select Tags editor for interactive data editing
- 🎨 **Custom Cell Renderers:** Display salaries, statuses, tags, and scores with custom UI components
- 🌙 **Light & Dark Mode:** Switch between different grid appearance modes
- 📡 **Live Data Updates:** Stream data changes into the grid using `useGridData`
- ♾️ **Server-Side Pagination:** Load records asynchronously through a paginated in-memory data source
- 📏 **Flexible Column Layout:** Move, reorder, resize, and pin columns
- 📌 **Frozen Rows:** Keep the first two rows fixed while scrolling
- 🗂️ **Row Grouping:** Group records by department and calculate aggregated values
- 📊 **Pivot Tables:** Build pivot views by department and status with salary and score aggregations
- 🎛️ **Interactive Demos:** Explore each feature through dedicated controls and configurations

---

## 🧪 Demo Sections

The playground includes seven demos, each focused on a different part of gp-grid.

### ⚡ Demo 1: Virtual Scrolling

Explore how gp-grid handles large datasets with:

- 15,000 rows
- 100,000 rows
- 1 million rows

Switch between dataset sizes and scroll through the records.

### ↕️ Demo 2: Sorting & Filtering

Explore how to organize and narrow down grid data using sorting and filtering.

### ✏️ Demo 3: Selection & Editing

Test interactive data manipulation with:

- Row selection
- Keyboard navigation
- Inline cell editing
- Fill handle
- Multi-select Tags editor

### 🎨 Demo 4: Renderers & Styling

Customize the way data appears inside the grid with:

- Custom salary renderers
- Status badges
- Tags and score renderers
- Light and dark modes

### 📡 Demo 5: Live & Server Data

Explore two data-loading approaches:

- **Live Data:** Stream updates into the grid using `useGridData`
- **Server Data:** Load records asynchronously through an in-memory paginated data source

The server-data example simulates asynchronous pagination without requiring an external backend.

### 📏 Demo 6: Flexible Column Layout

Experiment with grid layout controls:

- Drag and reorder columns
- Resize columns
- Pin columns
- Freeze the first two rows

### 📊 Demo 7: Grouping & Pivoting

Explore gp-grid's data organization capabilities:

- Group records by department
- Calculate count, sum, and average aggregations
- Create pivot views using departments and statuses
- Compare salary and score values across groups

---

## 🛠️ Tech Stack

![Tech Stack](https://skillicons.dev/icons?i=react,typescript,vite,css)

- **React**
- **TypeScript**
- **Vite**
- **CSS**
- **gp-grid**
- **React Select**

---

## ⚡ gp-grid

This project uses [gp-grid](https://gp-grid.io/) as its core data-grid library.

The goal wasn't simply to render a grid and display some records. I wanted to explore how gp-grid handles different requirements that can come up when building data-intensive React applications.

Features explored in this project include:

- Virtual scrolling with up to 1 million rows
- Sorting and filtering
- Row selection and inline editing
- Keyboard navigation and fill handle
- Custom cell renderers and editors
- Live data updates
- Asynchronous server-side pagination
- Column movement, resizing, and pinning
- Frozen rows
- Native row grouping
- Pivot tables and aggregations

---

## 🎯 Project Goals

- Explore **gp-grid** in a real React application
- Test virtual scrolling with datasets of different sizes
- Experiment with editing, selection, and custom cell rendering
- Work with live updates and asynchronous paginated data
- Explore flexible column layouts and frozen rows
- Test row grouping and pivoting with aggregated data
- Create practical examples that make gp-grid features easier to understand

---

## 🔧 Getting Started

Clone the repository:

```bash
git clone https://github.com/Hadil-Ben-Abdallah/gp-grid-playground
```

Navigate to the project directory:

```bash
cd gp-grid-playground
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local development URL shown in your terminal.

---

## 👤 Author

Hadil Ben Abdallah  
🎓 Software Engineer | 🖋 Technical Writer | 📱 Social Media Content Creator  
[🌐 Portfolio](https://hadilbenabdallah.vercel.app/) | [👩🏻‍💼 LinkedIn](https://www.linkedin.com/in/hadil-ben-abdallah/) | [📝 Dev.to](https://dev.to/hadil) | [🐦 X](https://x.com/hadilbnabdallah)

---

## 📜 License

[MIT License](LICENSE)

---

## 🌟 Show Your Support

If you like this project:

⭐️ Star the repo  
🔁 Share it with others  
🛠️ Fork it and build your version!

<h6 align="center">Made with 💙 By Hadil Ben Abdallah</h6>
