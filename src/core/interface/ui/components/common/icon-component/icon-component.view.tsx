import React, { useMemo, useCallback } from "react";
import { alpha, Box, Grid, Paper, Stack } from "@mui/material";
import { renderAccountIcon } from "@interface/presenters/helpers";
import {
  ACCOUNT_ICONS,
  CATEGORY_ICONS,
  ICON_TYPE,
  IconType,
} from "@interface/presenters/constants";

export interface IIconComponentView {
  children?: React.ReactNode
  formik: any;
  iconType: IconType;
}

const IconComponentView: React.FC<IIconComponentView> = ({ formik, iconType }) => {
  const selectedIcon = formik.values.icon ?? "Savings";
  const selectedColor = formik.values.color ?? "#006CD1";

  const iconEntries = useMemo(() => {
    const icons =
      iconType === ICON_TYPE.Account
        ? ACCOUNT_ICONS
        : iconType === ICON_TYPE.Category
        ? CATEGORY_ICONS
        : {};

    return Object.entries(icons);
  }, [iconType]);

  const handleSelectIcon = useCallback(
    (iconName: string) => {
      formik.setFieldValue("icon", iconName);
    },
    [formik]
  );

  return (
    <>
      {iconEntries.map(([iconName]) => {
        const isSelected = selectedIcon === iconName;

        return (
          <Grid key={iconName} size={3}>
            <Paper
              variant="outlined"
              onClick={() => handleSelectIcon(iconName)}
              sx={{
                p: 1.25,
                borderRadius: 2.5,
                cursor: "pointer",
                textAlign: "center",
                borderColor: isSelected ? "primary.main" : "divider",
                backgroundColor: isSelected
                  ? alpha(selectedColor, 0.1)
                  : "background.paper",
                boxShadow: isSelected ? 2 : 0,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Stack spacing={0.75} alignItems="center">
                <Box
                  sx={{
                    color: isSelected ? "primary.main" : "text.secondary",
                    display: "flex",
                    alignItems: "center",
                  }}>
                  {renderAccountIcon(iconName, selectedColor, 30)}
                </Box>
              </Stack>
            </Paper>
          </Grid>
        );
      })}
    </>
  );
};

export default React.memo(IconComponentView);