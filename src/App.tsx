import Header from "./components/Header";
import LocationDetails from "./components/LocaionDetails";
import SearchBar from "./components/SearchSection";
import TrendsSection from "./components/TrendsSection";
import Footer from "./components/Footer";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header />
      <SearchBar />
      <LocationDetails />
      <TrendsSection />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
