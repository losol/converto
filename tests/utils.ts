const getStrapiContext = (bodyConfig?: any, html: boolean = true) => {
  const validBody = html
    ? {
        html: "<html></html>",
      }
    : { url: "http://www.google.com/" };
  const body = bodyConfig
    ? {
        ...validBody,
        ...bodyConfig,
      }
    : {};
  const ctx: any = {
    request: {
      body,
    },
    body: null,
    throw: jest.fn(),
    set: () => {},
  };
  return ctx;
};

const getStrapiMockInstance = (serviceThrowsError: boolean = false) => {
  const impl = serviceThrowsError
    ? async () => {
        throw new Error();
      }
    : async () => Buffer.from("mock");
  return {
    plugin: jest.fn().mockReturnValue({
      service: jest.fn().mockReturnValue({
        url2pdf: jest.fn().mockImplementation(impl),
        html2pdf: jest.fn().mockImplementation(impl),
      }),
    }),
  };
};

export { getStrapiContext, getStrapiMockInstance };
