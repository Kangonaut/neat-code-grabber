import { useEffect, useState } from 'react'
import { Button, Container, Flex, Text, useToast } from '@chakra-ui/react'
import ProgrammingLanguageSelection from './components/ProgrammingLanguageSelection'
import ProblemDetailsDisplay from './components/ProblemDetailsDisplay'
import { FilePublic, ProblemDetails, StatusType, statusTypeEmoticons } from '../types'
import { ContentService } from '../services/content'
import { Utils } from '../services/utils'
import { ApiService } from '../services/api'
import UpsMessage from '../components/UpsMessage'

function PopupPage() {
  const toast = useToast();

  const [selectedLanguage, setSelectedLanguage] = useState("C++");
  const [problemDetails, setProblemDetails] = useState<ProblemDetails | null>(null);
  const [isProblemPage, setIsProblemPage] = useState(false);
  const [showUps, setShowUps] = useState<boolean>(false);

  const [editorContent, setEditorContent] = useState<string | null>(null);

  const [filename, setFilename] = useState<string | null>(null);
  const [file, setFile] = useState<FilePublic | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  function showToast(type: StatusType, message: string) {
    const emoticon = statusTypeEmoticons[type];
    toast({
      title: `${message} ${emoticon}`,
      status: type,
      duration: 3000,
      isClosable: true,
    });
  }

  async function loadData() {
    const isProblemPage = await Utils.isProblemPage();
    setIsProblemPage(isProblemPage);

    if (isProblemPage) {
      try {
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
      } catch (err) {
        showToast(StatusType.ERROR, err as string);
        setShowUps(true);
      }
    }
  }

  async function onCreate() {
    try {
      await ApiService.createRemoteFile(filename!, editorContent!);
      showToast(StatusType.SUCCESS, `${filename} created successfully`);
      loadData();
    } catch (err) {
      showToast(StatusType.ERROR, err as string);
    }
  }

  async function onUpdate() {
    try {
      await ApiService.updateRemoteFile(filename!, editorContent!, file!.sha);
      showToast(StatusType.SUCCESS, `${filename} updated successfully`);
      loadData();
    } catch (err) {
      showToast(StatusType.ERROR, err as string);
    }
  }

  function onCopyToClipboard() {
    navigator.clipboard.writeText(fileContent!);
    showToast(StatusType.INFO, "copied to clipboard");
  }

  return (
    <Container>
      {
        isProblemPage && !showUps &&
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

      <UpsMessage isActive={showUps} />
    </Container>
  )
}

export default PopupPage
