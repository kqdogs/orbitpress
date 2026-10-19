import { z } from "zod";
import {
  pageInput,
  pageUpdate,
  postInput,
  postUpdate,
  versionInput,
} from "./schema";
const postSchema = { ...z.toJSONSchema(postInput), $schema: undefined };
const updateSchema = { ...z.toJSONSchema(postUpdate), $schema: undefined };
const versionSchema = { ...z.toJSONSchema(versionInput), $schema: undefined };
const pageSchema = { ...z.toJSONSchema(pageInput), $schema: undefined };
const pageUpdateSchema = { ...z.toJSONSchema(pageUpdate), $schema: undefined };
const error = {
  description: "请求失败，返回稳定业务错误码",
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message", "requestId"],
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              requestId: { type: "string" },
            },
          },
        },
      },
    },
  },
};
const postResult = {
  type: "object",
  required: [
    ...(postSchema.required || []),
    "id",
    "status",
    "version",
    "createdAt",
    "updatedAt",
    "publishedAt",
  ],
  properties: {
    ...postSchema.properties,
    id: { type: "string" },
    status: { enum: ["draft", "published", "trash"] },
    version: { type: "integer", minimum: 1 },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    publishedAt: { type: ["string", "null"] },
    categoryName: { type: "string" },
    categorySlug: { type: "string" },
  },
  additionalProperties: false,
};
const pageResult = {
  type: "object",
  required: [
    ...(pageSchema.required || []),
    "id",
    "status",
    "version",
    "createdAt",
    "updatedAt",
    "publishedAt",
  ],
  properties: {
    ...pageSchema.properties,
    id: { type: "string" },
    status: { enum: ["draft", "published", "trash"] },
    version: { type: "integer", minimum: 1 },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    publishedAt: { type: ["string", "null"] },
  },
  additionalProperties: false,
};
const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string" },
};
const idem = {
  name: "Idempotency-Key",
  in: "header",
  required: true,
  schema: { type: "string", minLength: 8, maxLength: 100 },
};
const responses = (code = "200", schema = "Post") => ({
  [code]: {
    description: "成功",
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["data"],
          properties: { data: { $ref: `#/components/schemas/${schema}` } },
        },
      },
    },
  },
  "400": error,
  "401": error,
  "403": error,
  "404": error,
  "409": error,
  "413": error,
  "429": error,
});
const body = (schema: string) => ({
  required: true,
  content: {
    "application/json": { schema: { $ref: `#/components/schemas/${schema}` } },
  },
});
export const openapi = {
  openapi: "3.1.0",
  info: {
    title: "OrbitPress Content API",
    version: "1.0.0",
    description:
      "供 AI Agent 调用的内容接口；创建始终写入草稿。管理后台创建 Bearer 密钥。",
  },
  servers: [{ url: "/" }],
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/v1/posts": {
      get: {
        operationId: "listPosts",
        summary: "读取文章",
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { enum: ["draft", "published", "trash"] },
          },
          {
            name: "q",
            in: "query",
            schema: { type: "string", maxLength: 100 },
          },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "tag", in: "query", description: "按标签精确匹配，不区分英文大小写", schema: { type: "string", minLength: 1, maxLength: 30 } },
          { name: "cursor", in: "query", schema: { type: "string" } },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 24, default: 12 },
          },
        ],
        responses: {
          "200": {
            description: "分页列表",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: {
                      type: "object",
                      required: ["items", "nextCursor"],
                      properties: {
                        items: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Post" },
                        },
                        nextCursor: { type: ["string", "null"] },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": error,
          "401": error,
          "403": error,
        },
      },
      post: {
        operationId: "createDraft",
        summary: "创建草稿，需要 content:write",
        parameters: [idem],
        requestBody: body("PostInput"),
        responses: responses("201"),
      },
    },
    "/api/v1/posts/{id}": {
      get: {
        operationId: "getPost",
        summary: "读取文章，需要 content:read",
        parameters: [idParam],
        responses: responses(),
      },
      put: {
        operationId: "updatePost",
        summary:
          "更新文章，需要 content:write；更新已发布文章还需 content:publish",
        parameters: [idParam, idem],
        requestBody: body("PostUpdate"),
        responses: responses(),
      },
    },
    "/api/v1/posts/{id}/publish": {
      post: {
        operationId: "publishPost",
        summary: "发布草稿，需要 content:publish",
        parameters: [idParam, idem],
        requestBody: body("VersionInput"),
        responses: responses(),
      },
    },
    "/api/v1/posts/{id}/unpublish": {
      post: {
        operationId: "unpublishPost",
        summary: "下架文章，需要 content:publish",
        parameters: [idParam, idem],
        requestBody: body("VersionInput"),
        responses: responses(),
      },
    },
    "/api/v1/pages": {
      get: {
        operationId: "listPages",
        summary: "读取页面，需要 content:read",
        description: "按发布时间或更新时间降序返回，最多 100 项。",
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { enum: ["draft", "published", "trash"] },
          },
          {
            name: "q",
            in: "query",
            schema: { type: "string", maxLength: 100 },
          },
        ],
        responses: {
          "200": {
            description: "页面列表，最多100项",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Page" },
                    },
                  },
                },
              },
            },
          },
          "401": error,
          "403": error,
        },
      },
      post: {
        operationId: "createPageDraft",
        summary: "创建页面草稿，需要 content:write",
        parameters: [idem],
        requestBody: body("PageInput"),
        responses: responses("201", "Page"),
      },
    },
    "/api/v1/pages/{id}": {
      get: {
        operationId: "getPage",
        summary: "读取页面，需要 content:read",
        parameters: [idParam],
        responses: responses("200", "Page"),
      },
      put: {
        operationId: "updatePage",
        summary:
          "更新页面，需要 content:write；更新已发布页面还需 content:publish",
        parameters: [idParam, idem],
        requestBody: body("PageUpdate"),
        responses: responses("200", "Page"),
      },
    },
    "/api/v1/pages/{id}/publish": {
      post: {
        operationId: "publishPage",
        summary: "发布页面，需要 content:publish",
        parameters: [idParam, idem],
        requestBody: body("VersionInput"),
        responses: responses("200", "Page"),
      },
    },
    "/api/v1/pages/{id}/unpublish": {
      post: {
        operationId: "unpublishPage",
        summary: "下架页面，需要 content:publish",
        parameters: [idParam, idem],
        requestBody: body("VersionInput"),
        responses: responses("200", "Page"),
      },
    },
    "/api/v1/categories": {
      get: {
        operationId: "listCategories",
        summary: "读取未删除分类，需要 content:read",
        responses: {
          "200": {
            description: "分类列表",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          slug: { type: "string" },
                          description: { type: "string" },
                          icon: { type: "string", description: "原有图标标识，或 ep: 前缀的 Element Plus 图标白名单名称" },
                          count: { type: "integer" },
                          version: { type: "integer" },
                          deletedAt: { type: ["string", "null"] },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": error,
          "403": error,
        },
      },
    },
  },
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } },
    schemas: {
      PostInput: postSchema,
      PostUpdate: updateSchema,
      VersionInput: versionSchema,
      Post: postResult,
      PageInput: pageSchema,
      PageUpdate: pageUpdateSchema,
      Page: pageResult,
    },
  },
};
