import { Button, Container, Text } from '@chakra-ui/react';
import { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

interface CodeDiffViewProps {
    localVersion: string;
    remoteVersion: string;
}

function CodeDiffView({ localVersion, remoteVersion }: CodeDiffViewProps) {
    const [showDiff, setShowDiff] = useState<boolean>(false);

    function toggleShowDiff() {
        setShowDiff(!showDiff);
    }

    return (
        <Container m="auto" mt={10} centerContent>
            {localVersion === remoteVersion &&
                <Text fontStyle="italic" fontSize="lg" color="gray">versions are identical</Text>
            }
            {localVersion !== remoteVersion &&
                <>
                    <Button onClick={toggleShowDiff}>{showDiff ? "hide" : "show"} diff</Button>
                    {showDiff &&
                        <Container m="auto" mt={5} centerContent>
                            < ReactDiffViewer oldValue={remoteVersion} newValue={localVersion} splitView={true} useDarkTheme={true} />
                        </Container>
                    }
                </>
            }
        </Container>
    );
}

export default CodeDiffView;