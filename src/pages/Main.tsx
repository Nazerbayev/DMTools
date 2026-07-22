import { Link } from "wouter";
import { Button, Flex, Text } from "@radix-ui/themes";

const Main = () => {
  return (
    <main>
      <Link href="/about">About</Link>
      <Flex direction="column" gap="2">
        <Text>Hello from Radix Themes :)</Text>
        <Button>Let's go</Button>
      </Flex>
    </main>
  );
};

export default Main;
