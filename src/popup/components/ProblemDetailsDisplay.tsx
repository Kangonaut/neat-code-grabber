import { Container, Heading, Text } from "@chakra-ui/react";
import { ProblemDetails } from "../../types";

interface ProblemDetailsProps {
    problemDetails: ProblemDetails;
}

function ProblemDetailsDisplay({ problemDetails }: ProblemDetailsProps) {
    return (
        <>
            <Container alignContent="start" textAlign="left">
                <Heading size="md">Problem</Heading>
                <Text fontSize="md" mt={3}>{problemDetails.id}. {problemDetails.title}</Text>
            </Container>
        </>
    );
}

export default ProblemDetailsDisplay