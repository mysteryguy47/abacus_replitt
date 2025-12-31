import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";
import Home from "./pages/Home";
import PaperCreate from "./pages/PaperCreate";
import Mental from "./pages/Mental";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/create/junior" component={PaperCreate} />
        <Route path="/create/basic" component={PaperCreate} />
        <Route path="/create/advanced" component={PaperCreate} />
        <Route path="/create" component={PaperCreate} />
        <Route path="/vedic-maths/level-1" component={PaperCreate} />
        <Route path="/vedic-maths/level-2" component={PaperCreate} />
        <Route path="/vedic-maths/level-3" component={PaperCreate} />
        <Route path="/vedic-maths/level-4" component={PaperCreate} />
        <Route path="/mental" component={Mental} />
        <Route component={NotFound} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;

