import { ChakraProvider } from '@chakra-ui/react'
import './App.css'
import OptionsCheckBoundary from './components/OptionsCheckBoundary'
import PopupPage from './PopupPage'

function App() {
    return (
        <ChakraProvider>
            <OptionsCheckBoundary>
                <PopupPage />
            </OptionsCheckBoundary>
        </ChakraProvider>
    )
}

export default App
