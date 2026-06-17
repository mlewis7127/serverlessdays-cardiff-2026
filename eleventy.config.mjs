import markdownIt from "markdown-it";

export default function (eleventyConfig) {
  const md = markdownIt({ html: true });

  eleventyConfig.setFreezeReservedData(false);
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/static");

  // Register a "markdown" shortcode for inline markdown rendering
  eleventyConfig.addShortcode("markdown", (content) => {
    if (!content) return "";
    return md.render(content);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
