import { CourseTabLink } from '@src/course-tabs/CourseTabLink';
import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

interface CourseTabLinkListProps {
  tabs: Array<{
    title: string;
    slug: string;
    url: string;
    titleMessage?: { id: string; defaultMessage: string; description?: string };
  }>,
  activeTabSlug?: string;
}

export const CourseTabLinksList = ({ tabs, activeTabSlug }: CourseTabLinkListProps) => {
  const intl = useIntl();
  return (
    <>
      {tabs.map(({
        url, title, slug, titleMessage,
      }) => (
        <CourseTabLink
          key={slug}
          url={url}
          slug={slug}
          title={titleMessage ? intl.formatMessage(titleMessage) : title}
          activeTabSlug={activeTabSlug}
        />
      ))}
    </>
  );
};
