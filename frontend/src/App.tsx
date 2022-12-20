import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home";
import {CreateCard} from "./pages/CreateCard/CreateCard";
import {ViewCard} from "./pages/ViewCard";
import {CssBaseline} from "@mui/material";
import {NotFound} from "./pages/NotFound";


function App() {
    return (
        <div>
            <CssBaseline/>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/create" element={<CreateCard/>}/>
                    <Route path="/card/:id" element={<ViewCard/>}/>
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
