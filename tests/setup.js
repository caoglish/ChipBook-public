// tests/setup.js or at the top of your test file
import { TextEncoder, TextDecoder } from "util";
import "web-streams-polyfill"; // 添加 ReadableStream 的 polyfill
import { ReadableStream } from "web-streams-polyfill"; // 添加 ReadableStream 的 polyfill

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;

jest.spyOn(console, "error").mockImplementation(() => {});

