import { Select } from "@chakra-ui/select";
import { programmingLanguageExtensions } from "../../languages";

interface ProgrammingLanguageSelectionProps {
    selectedLanguage: string;
    setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
}

function ProgrammingLanguageSelection({ selectedLanguage, setSelectedLanguage }: ProgrammingLanguageSelectionProps) {
    

    return (
        <Select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
        >
            {
                Object.keys(programmingLanguageExtensions).map((language) => (
                    <option key={language} value={language}>
                        {language}
                    </option>
                ))
            }
        </Select>
    );
}

export default ProgrammingLanguageSelection