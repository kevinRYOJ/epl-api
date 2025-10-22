import "@testing-library/jest-dom";
import React from "react";

// Nonaktifkan StrictMode agar useEffect tidak dipanggil 2x di testing
React.StrictMode = function ({ children }) {
    return children;
};

