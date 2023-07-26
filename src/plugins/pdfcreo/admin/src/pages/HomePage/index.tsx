/*
 *
 * HomePage
 *
 */

import React from "react";

import { Box, Flex, Typography } from "@strapi/design-system";

const HomePage = () => {
  return (
    <>
      <Box paddingTop={10} paddingLeft={6} paddingBottom={10}>
        <Flex direction="column" alignItems="flex-start" gap={5}>
          <Typography as="h1" variant="alpha">
            Pdfcreo
          </Typography>
          <Typography as="p" variant="omega">
            Generates PDF from HTML.
          </Typography>
        </Flex>
      </Box>
    </>
  );
};

export default HomePage;
