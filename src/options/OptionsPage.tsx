import { Button, Card, CardBody, CardHeader, ChakraProvider, Container, Heading, Input, Select, StackDivider, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import OptionsService from "../services/options";
import { Options, StatusType, statusTypeEmoticons } from "../types";
import UpsMessage from "../components/UpsMessage";

function OptionsPage() {
    const toast = useToast();

    const [apiToken, setApiToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [repository, setRepository] = useState<string | null>(null);
    const [showUps, setShowUps] = useState<boolean>(false);

    useEffect(() => {
        loadOptions();
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

    async function onSave() {
        try {
            const options: Options = {
                ...{
                    apiToken,
                    username,
                    email,
                    repository
                }
            };
            await OptionsService.saveOptions(options);
            showToast(StatusType.SUCCESS, "successfully saved");
            loadOptions();
        } catch (err) {
            showToast(StatusType.ERROR, err as string);
        }
    }

    async function loadOptions() {
        try {
            const options = await OptionsService.loadOptions();

            setApiToken(options.apiToken);
            setUsername(options.username);
            setEmail(options.email);
            setRepository(options.repository);
        } catch (err) {
            showToast(StatusType.ERROR, err as string);
            setShowUps(true);
        }
    }

    function setColorMode(colorMode: string) { 
        localStorage.setItem("chakra-ui-color-mode", colorMode);
        window.location.reload();
    }

    return (
        <ChakraProvider>
            <Container m="auto" mt={10}>
                <Heading>Options :D</Heading>
                {/* content */}
                {
                    !showUps && <>
                        {/* General */}
                        <Card mt={10}>
                            <CardHeader>
                                <Heading size="md">GitHub</Heading>
                            </CardHeader>

                            <CardBody>
                                <VStack spacing={5} divider={<StackDivider />}>
                                    <Container>
                                        <Heading size="xs">Appearance</Heading>
                                        <Select
                                            value={localStorage.getItem("chakra-ui-color-mode") ?? "light"}
                                            onChange={e => setColorMode(e.target.value)}
                                            mt={3}
                                        >
                                            <option value="dark">Dark</option>
                                            <option value="light">Light</option>
                                        </Select>
                                    </Container>
                                </VStack>
                            </CardBody>
                        </Card>

                        {/* GitHub */}
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
                                            type="email"
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

                        {/* save button */}
                        <Container m="auto" mt={10} centerContent>
                            <Button onClick={onSave}>save</Button>
                        </Container>
                    </>
                }

                <UpsMessage isActive={showUps} />
            </Container>
        </ChakraProvider>
    );
}

export default OptionsPage
