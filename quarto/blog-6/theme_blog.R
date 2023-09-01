theme_blog <- \(...) {
  theme_test() +
    theme(
      legend.title = element_blank(),
      legend.position = c(.9, .15),
      panel.border = element_blank(),
      axis.line = element_line(color = "#b0b0b066"), # faded grey
      axis.ticks = element_line(color = "#b0b0b066"),
      axis.text = element_text(color = "#b0b0b066"),
      axis.title = element_text(color = "#b0b0b066"),
      axis.title.y = element_text(angle = 0, vjust = 1, size = 20),
      axis.title.x = element_text(angle = 0, hjust = 1, size = 20),
      plot.background = element_rect(fill = "#3b4252", color = "#3b4252"), # nord1
      panel.background = element_rect(fill = "#3b4252"), # nord1
      legend.background = element_rect(fill = "#3b4252"),
      legend.key = element_rect(fill = "#3b4252"),
      legend.text = element_text(color = "#eceff4"), #nord 4
      ...
    )
} 