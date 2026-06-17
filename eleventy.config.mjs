import markdownIt from "markdown-it";
import { PurgeCSS } from "purgecss";
import CleanCSS from "clean-css";
import { JSDOM } from "jsdom";

const md = markdownIt({ html: true });

const cssFiles = ["./src/css/custom.css", "./src/css/markdown.css", "./src/css/tachyons.css"];

const cleanCSSOptions = {
  level: {
    2: {
      all: true,
      removeDuplicateRules: true,
    },
  },
};

function insertCss(html, css) {
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const head = document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = css;
  head.appendChild(style);
  return dom.serialize();
}

export default function (eleventyConfig) {
  eleventyConfig.setFreezeReservedData(false);
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/static");

  eleventyConfig.addShortcode("markdown", (text) => {
    if (!text) return "";
    return md.render(text);
  });

  eleventyConfig.addTransform("purgeCSS", async function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      const purgecssResult = await new PurgeCSS().purge({
        content: [{ raw: content, extension: "html" }],
        css: cssFiles,
      });
      let cssMerge = "";
      if (purgecssResult.length > 0) {
        for (let i = 0; i < purgecssResult.length; i++) {
          cssMerge = cssMerge.concat(purgecssResult[i].css);
        }
        const cssMin = new CleanCSS(cleanCSSOptions).minify(cssMerge).styles;
        return insertCss(content, cssMin);
      }
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
  };
}
