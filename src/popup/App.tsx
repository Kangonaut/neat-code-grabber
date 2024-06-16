import { useEffect, useState } from 'react'
import './App.css'
import { Button, ChakraProvider, Container, Flex, Heading, Text } from '@chakra-ui/react'
import ProgrammingLanguageSelection from './components/ProgrammingLanguageSelection'
import ProblemDetailsDisplay from './components/ProblemDetailsDisplay'
import { FilePublic, ProblemDetails } from '../types'
import { ContentService } from './services/content'
import { Utils } from './services/utils'
import { ApiService } from './services/api'

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("C++");
  const [problemDetails, setProblemDetails] = useState<ProblemDetails | null>(null);
  const [isProblemPage, setIsProblemPage] = useState(false);

  const [editorContent, setEditorContent] = useState<string | null>(null);

  const [filename, setFilename] = useState<string | null>(null);
  const [file, setFile] = useState<FilePublic | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    console.log("running loadData");

    const isProblemPage = await Utils.isProblemPage();
    setIsProblemPage(isProblemPage);

    // get problem details
    const problemDetails = await ContentService.getProblemDetails();
    setProblemDetails(problemDetails);
    console.log(`problem details: ${JSON.stringify(problemDetails)}`);

    // get programming language
    const language = await ContentService.getProgrammingLanguage();
    setSelectedLanguage(language);

    // get editor content
    const editorContent = await ContentService.getEditorContent();
    setEditorContent(editorContent);

    // get remote file
    const filename = Utils.buildFilename(problemDetails!.id, language);
    setFilename(filename);

    const file = await ApiService.getRemoteFile(filename);
    setFile(file);

    const fileContent = atob(file?.content ?? "");
    setFileContent(fileContent);

    // enable valid actions
    setValidActions();
  }

  function setValidActions() {

  }

  async function onCreate() {
    await ApiService.createRemoteFile(filename!, editorContent!);
    loadData();
  }

  async function onUpdate() {
    await ApiService.updateRemoteFile(filename!, editorContent!, file!.sha);
    loadData();
  }

  function onCopyToClipboard() {
    navigator.clipboard.writeText(fileContent!);
  }

  return (
    <ChakraProvider>
      <Container>
        <Heading size="md">NeatCode Grabber :D</Heading>
        {
          isProblemPage &&
          <>
            <Container marginTop={5}>
              {
                problemDetails && <ProblemDetailsDisplay problemDetails={problemDetails} />
              }
            </Container>

            <Container marginTop={5}>
              <ProgrammingLanguageSelection {...{ selectedLanguage, setSelectedLanguage }} />
            </Container>

            <Flex justify="center" marginTop={5} gap={2}>
              <Button onClick={onCreate} isDisabled={Boolean(!(problemDetails && !file))}>create</Button>
              <Button onClick={onUpdate} isDisabled={Boolean(!(file && editorContent !== fileContent))}>update</Button>
            </Flex>

            <Flex justify="center" marginTop={3} gap={2}>
              <Button onClick={onCopyToClipboard} isDisabled={Boolean(!file)}>copy to clipboard</Button>
            </Flex>
          </>
        }
        {
          !isProblemPage &&
          <>
            <Container marginTop={5}>
              <Text>you need to open a LeetCode problem</Text>
            </Container>
          </>
        }
      </Container>
    </ChakraProvider>
  )
}

export default App
