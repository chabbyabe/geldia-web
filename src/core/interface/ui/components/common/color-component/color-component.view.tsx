import React, { useMemo, useState } from "react";
import {
  alpha, Box, Grid, Paper, Stack,
  Dialog, DialogContent, DialogTitle, IconButton, TextField, Tooltip
} from "@mui/material";
import { COLOR_OPTIONS } from "@interface/presenters/constants";
import { CheckCircle, Close, Palette } from "@mui/icons-material";

export interface IColorComponentView {
  children?: React.ReactNode
  formik: any;
}

const ColorComponentView: React.FC<IColorComponentView> = (props) => {
  const [open, setOpen] = useState(false);

  const selectedColor = props.formik.values.color || "#2196F3";

  const isValidHex = (value: string) =>
    /^#([0-9A-F]{3}){1,2}$/i.test(value);

  const palette = useMemo(() => {
    if (
      selectedColor &&
      !COLOR_OPTIONS.includes(selectedColor) &&
      isValidHex(selectedColor)
    ) {
      return [...COLOR_OPTIONS, selectedColor];
    }

    return COLOR_OPTIONS;
  }, [selectedColor]);

  return (
    <>
      {palette.map((color) => {
        const isSelected = props.formik.values.color === color

        return (
          <Grid key={color} size={2}>
            <Paper
              variant="outlined"
              onClick={() => props.formik.setFieldValue("color", color)}
              sx={{
                p: 1,
                borderRadius: 2.5,
                cursor: "pointer",
                borderColor: isSelected ? color : alpha(color, 0.25),
                backgroundColor: isSelected ? alpha(color, 0.14) : "background.paper",
                boxShadow: isSelected ? 2 : 0,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: color,
                  transform: "translateY(-1px)"
                }
              }}
            >
              <Stack spacing={0.75} alignItems="center">
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: "1px solid #fff",
                    boxShadow: `0 0 0 1px ${alpha(color, 0.25)}`
                  }}
                />
                <Box sx={{ height: 18 }}>
                  {isSelected ? <CheckCircle sx={{ color, fontSize: 18 }} /> : null}
                </Box>
              </Stack>
            </Paper>
          </Grid>
        )
      })}

      <Grid>
        <Tooltip title="Custom Color">
          <Paper
            variant="outlined"
            onClick={() => setOpen(true)}
            sx={{
              p: 1,
              borderRadius: 2.5,
              cursor: "pointer",
              borderStyle: "dashed",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: selectedColor,
                transform: "translateY(-1px)"
              }
            }}
          >
            <Stack spacing={0.75} alignItems="center">
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: `linear-gradient(
                    135deg,
                    #ff4d4f,
                    #faad14,
                    #52c41a,
                    #1677ff,
                    #722ed1
                  )`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Palette sx={{ color: "#fff", fontSize: 18 }} />
              </Box>

              <Box sx={{ height: 18 }} />
            </Stack>
          </Paper>
        </Tooltip>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1
          }}
        >
          Pick Custom Color

          <IconButton size="small" onClick={() => setOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ pt: 1 }}>
            <Box
              component="input"
              type="color"
              value={selectedColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                props.formik.setFieldValue("color", e.target.value)
              }
              sx={{
                width: 90,
                height: 90,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                p: 0
              }}
            />

            <TextField
              label="HEX Color"
              value={selectedColor}
              onChange={(e) => {
                props.formik.setFieldValue("color", e.target.value);
              }}
              placeholder="#2196F3"
              fullWidth
            />

            <Paper
              variant="outlined"
              sx={{
                width: "100%",
                height: 56,
                borderRadius: 2,
                backgroundColor: isValidHex(selectedColor)
                  ? selectedColor
                  : "#fff"
              }}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(ColorComponentView);