
# Setup -------------------------------------------------------------------

library(tibble)
library(mvtnorm)
library(ellipse)
library(tidyverse)
library(ggfx)


# Parameters --------------------------------------------------------------

base_version <- FALSE

rho <- .5
sig1 <- 2
sig2 <- 1.5


# Main --------------------------------------------------------------------

mat <- matrix(c(sig1^2, rho * sig1 * sig2,
                rho*sig1*sig2, sig2^2), nrow = 2)

v1 <- eigen(mat)$vectors[,1]
v2 <- eigen(mat)$vectors[,2]

# Major Axis vs regression line? ------------------------------------------

dat <- rmvnorm(5000,mean = c(0, 0), sigma = mat)
mod <- lm(dat[,2]~dat[,1])

get_slope <- function() {
  dat <- rmvnorm(5000,mean = c(0, 0), sigma = mat)
  mod <- lm(dat[,2]~dat[,1])
  coef(mod)[2]
}

sim_slopes <- replicate(500, get_slope())

# they center around the population slope
# plot(sim_slopes)
# abline(h = mat[1, 2] / mat[1,1])
# modx <- lm(dat[,1]~dat[,2])
# mat[1,2] / mat[2, 2]


# base version ------------------------------------------------------------

if (base_version) {
  plot(dat, pch = ".", type = "n")
  # ellipse axis... 
  abline(a = 0, b = v1[2] / v1[1], col = 2)
  abline(a = 0, b = v2[2] / v2[1], col = 2)
  lines(ellipse(mat), col = 2)
  lines(ellipse(mat, level = .6), col = 2)
  lines(ellipse(mat, level = .3), col = 2)
  abline(a = 0, b = mat[1, 2] / mat[1,1], col = 3)
  abline(a = 0, b = mat[1,2] / mat[2, 2], col = 4)
}

# ggplot version might look cleaner

g1 <- dat |> 
  as_tibble(.name_repair = ~c("x", "y")) |> 
  ggplot(aes(x = x, y = y)) +
  as_reference(
    geom_polygon(mapping = aes(x, y),
                 data = as.data.frame(ellipse(mat))),
    id = "ellipse"
  ) +
  geom_point(pch = 16,
             size = .4,
             alpha = .6) +
  # geom_smooth(method = "lm",se = F) + 
  geom_abline(aes(intercept = 0, slope=mat[1, 2] / mat[1,1], color = "y~x"), linewidth = 1.2) +
  geom_abline(aes(intercept = 0, slope=mat[1, 2] / mat[2, 2], color = "x~y"), linewidth = 1.2) +
  with_mask(
    geom_abline(aes(intercept = 0, slope = v1[2]/v1[1]), alpha = 1, linewidth=1.1),
    mask = ch_alpha("ellipse")
  ) +
  with_mask(
    geom_abline(aes(intercept = 0, slope = v2[2]/v2[1]), alpha = 1, linewidth=1.1),
    mask = ch_alpha("ellipse")
  ) + 
  geom_path(mapping = aes(x, y ),
            data = as.data.frame(ellipse(mat)),
            alpha = 1) + 
  scale_color_manual(values = c("#ebcb8b", "#a3be8c")) +
  coord_cartesian(xlim = c(-5, 5), ylim = c(-5, 5)) +
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
    legend.text = element_text(color = "#eceff4") #nord 4
  )
g1


ggsave(plot = g1,
       filename = "major_axis_vs_regression.svg",
       bg = "#3b4252",
       width = 4.2,
       height = 4)


