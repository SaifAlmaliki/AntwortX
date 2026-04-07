import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, COLORS } from "../styles";
import { stripInlineMarkdownForPdf } from "../markdown-pdf-blocks";

interface MarkdownTableProps {
  headers: string[];
  rows: string[][];
}

/** Renders a GFM-style pipe table for react-pdf (AgentSection body). */
export function MarkdownTable({ headers, rows }: MarkdownTableProps) {
  const colCount = Math.max(headers.length, 1);
  const cellFlex = 1;

  return (
    <View
      style={{
        marginVertical: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <View style={[styles.tableHeader, { paddingVertical: 6, alignItems: "stretch" }]}>
        {Array.from({ length: colCount }, (_, ci) => (
          <Text
            key={`h-${ci}`}
            style={{
              flex: cellFlex,
              fontSize: 8,
              fontWeight: "bold",
              color: COLORS.heading,
              paddingHorizontal: 6,
              borderRightWidth: ci < colCount - 1 ? 1 : 0,
              borderRightColor: COLORS.border,
            }}
          >
            {stripInlineMarkdownForPdf(headers[ci] ?? "")}
          </Text>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View
          key={`r-${ri}`}
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingVertical: 5,
            alignItems: "flex-start",
            backgroundColor: ri % 2 === 1 ? COLORS.tableStripe : "transparent",
          }}
        >
          {Array.from({ length: colCount }, (_, ci) => (
            <Text
              key={`c-${ri}-${ci}`}
              style={{
                flex: cellFlex,
                fontSize: 8,
                color: COLORS.muted,
                lineHeight: 1.45,
                paddingHorizontal: 6,
                borderRightWidth: ci < colCount - 1 ? 1 : 0,
                borderRightColor: COLORS.border,
              }}
            >
              {stripInlineMarkdownForPdf(row[ci] ?? "")}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
