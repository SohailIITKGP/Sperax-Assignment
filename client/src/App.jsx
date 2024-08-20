import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import WatchList from "./components/WatchList";
import HistoricalData from "./components/HistoricalData"; // Import the HistoricalData component

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
    </div>
    <Services />
    <WatchList />
    <HistoricalData />
    <Transactions />
    <Footer />
  </div>
);

export default App;
