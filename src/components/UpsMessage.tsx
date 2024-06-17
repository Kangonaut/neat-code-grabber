import { Container, Text } from "@chakra-ui/react";

interface UpsMessageProps {
    isActive: boolean;
}

function UpsMessage({ isActive }: UpsMessageProps) {
    if (isActive) {
        return <>
            <Container m="auto" mt={10} centerContent>
                <Text fontStyle="italic" fontSize="lg" color="gray">Ups, something went wrong :(</Text>
            </Container>
        </>
    }
    return <></>;
}

export default UpsMessage;