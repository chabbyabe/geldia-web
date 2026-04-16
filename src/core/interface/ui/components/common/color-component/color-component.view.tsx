import React from "react";
import { alpha, Box, Grid, Paper, Stack } from "@mui/material";
import {
  ACCOUNT_ICONS,
  CATEGORY_ICONS,
  COLOR_OPTIONS,
  ICON_TYPE,
  IconType,
} from "@interface/presenters/constants";
import { CheckCircle } from "@mui/icons-material";

export interface IColorComponentView {
  children?: React.ReactNode
  formik: any;
}

const ColorComponentView: React.FC<IColorComponentView> = (props) => {
  const colors = COLOR_OPTIONS;
  return (
    <>
      {colors.map((color) => {
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
    </>
  );
};

export default React.memo(ColorComponentView);