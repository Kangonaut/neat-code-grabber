import { Button, Card, CardBody, CardHeader, ChakraProvider, Container, Heading, Input, StackDivider, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import OptionsService from "./services/options";
import { Options } from "../types";

function OptionsPage() {
    const [apiToken, setApiToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [repository, setRepository] = useState<string | null>(null);

    useEffect(() => {
        loadOptions();
    }, []);

    async function onSave() {
        const options: Options = {
            ...{
                apiToken,
                username,
                email,
                repository
            }
        };
        await OptionsService.saveOptions(options);
        loadOptions();
    }

    async function loadOptions() {
        const options = await OptionsService.loadOptions();

        setApiToken(options.apiToken);
        setUsername(options.username);
        setEmail(options.email);
        setRepository(options.repository);
    }

    return (
        <ChakraProvider>
            <Container m="auto" mt={10}>
                <Heading size="lg">NeatCode Grabber - Options</Heading>

                <Card mt={10}>
                    <CardHeader>
                        <Heading size="md">GitHub</Heading>
                    </CardHeader>

                    <CardBody>
                        <VStack spacing={5} divider={<StackDivider />}>
                            <Container>
                                <Heading size="xs">GitHub API Token</Heading>
                                <Input
                                    value={apiToken ?? ""}
                                    onChange={e => setApiToken(e.target.value)}
                                    placeholder="your GitHub API token"
                                    type="password"
                                    mt={3}
                                />
                            </Container>

                            <Container>
                                <Heading size="xs">GitHub Username</Heading>
                                <Input
                                    value={username ?? ""}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="your GitHub username"
                                    type="text"
                                    mt={3}
                                />
                            </Container>

                            <Container>
                                <Heading size="xs">GitHub Email</Heading>
                                <Input
                                    value={email ?? ""}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your GitHub email"
                                    type="text"
                                    mt={3}
                                />
                            </Container>

                            <Container>
                                <Heading size="xs">GitHub Repository Name</Heading>
                                <Input
                                    value={repository ?? ""}
                                    onChange={e => setRepository(e.target.value)}
                                    placeholder="your GitHub repository name"
                                    type="text"
                                    mt={3}
                                />
                            </Container>
                        </VStack>
                    </CardBody>
                </Card>

                <Container m="auto" mt={10} centerContent>
                    <Button onClick={onSave}>save</Button>
                </Container>
            </Container>
        </ChakraProvider>
    );
}

export default OptionsPage
