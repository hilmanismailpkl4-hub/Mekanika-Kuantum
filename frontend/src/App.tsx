import { Routes, Route, Navigate } from "react-router-dom";
import GameLayout, { RootProviders } from "./layout";
import { Home, AdventureMap, ChapterView, Quiz, Journal, Settings } from "./pages";

export default function App() {
    return (
        <RootProviders>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<GameLayout />}>
                    <Route path="/map" element={<AdventureMap />} />
                    <Route path="/chapter/:id" element={<ChapterView />} />
                    <Route path="/quiz/:id" element={<Quiz />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </RootProviders>
    );
}
