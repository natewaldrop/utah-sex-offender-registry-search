javascript: !function () { 
    const e = document.createElement("script"); 
    e.src = "https://raw.githubusercontent.com/natewaldrop/utah-sex-offender-registry-search/refs/heads/main/test-search.js"; 
    e.type = "text/javascript"; 
    e.onload = () => console.log("test-search.js loaded successfully."); 
    e.onerror = (error) => console.error("Failed to load test-search.js.", error); 
    document.head.appendChild(e); 
}();
