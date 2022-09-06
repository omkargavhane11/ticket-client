import { Routes, Route } from "react-router-dom";
import QueriesPage from "./pages/queriesPage/QueriesPage";
import CreateQueryPage from "./pages/createQueryPage/CreateQueryPage";
import SingleQueryPage from "./pages/singleQueryPage/SingleQueryPage";
import Login from "./pages/loginPage/Login";
import Pick from "./pages/pickQuery/Pick";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/queries" element={<QueriesPage />} />
          <Route path="/create" element={<CreateQueryPage />} />
          <Route path="/query/:queryNo" element={<SingleQueryPage />} />
          <Route path="/pick_new_query" element={<Pick />} />
        </Routes>
      </ChakraProvider>
    </div>
  );
}

export default App;
