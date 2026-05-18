-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_createdAt_idx" ON "AnalyticsEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_visitorId_type_createdAt_idx" ON "AnalyticsEvent"("visitorId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_type_createdAt_idx" ON "AnalyticsEvent"("sessionId", "type", "createdAt");
