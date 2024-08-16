"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb";
import Link from "next/link";

export default function BreadCrumbs() {
  const pathname = usePathname();
  const pathsArray = ["/"];
  const parts = pathname.split("/").filter((part) => part);
  let currentPath = "";
  for (const part of parts) {
    currentPath += `/${part}`;
    pathsArray.push(currentPath);
  }
  return (
    <Breadcrumb className="px-5 md:px-10 mt-5">
      <BreadcrumbList>
        {pathsArray.length > 0 &&
          pathsArray.map((path, index) => {
            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink className="capitalize" asChild>
                    <Link href={`${path}`}>
                      {index === 0 ? "Home" : path.split("/").pop()}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index != pathsArray.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
